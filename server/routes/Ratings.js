const express = require("express");
const router = express.Router();
const { Ratings, Posts, Users, Dares, sequelize } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// POST route (Agregar o actualizar calificaciones)
router.post("/", validateToken, async (req, res) => {
  const { PostId, ratingValue } = req.body;
  const UserId = req.user.id;

  try {
    // Iniciar una transacción para asegurar la consistencia de los datos
    await sequelize.transaction(async (t) => {
      // Buscar si el usuario ya ha calificado este post
      const found = await Ratings.findOne({
        where: { PostId: PostId, UserId: UserId },
        transaction: t,
      });

      if (!found) {
        // Crear una nueva calificación
        await Ratings.create(
          {
            PostId: PostId,
            UserId: UserId,
            ratingValue: ratingValue,
          },
          { transaction: t }
        );
      } else {
        // Actualizar la calificación existente
        await Ratings.update(
          { ratingValue: ratingValue },
          {
            where: { PostId: PostId, UserId: UserId },
            transaction: t,
          }
        );
      }

      // Actualizar el promedio de calificaciones del post
      await updateAverageRating(PostId, t);
    });

    res.json("Success");
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: "Error updating rating" });
  }
});

// Función para actualizar el promedio de calificaciones de un post
const updateAverageRating = async (postId, transaction) => {
  try {
    // Obtener todas las calificaciones del post
    const ratings = await Ratings.findAll({
      where: { PostId: postId },
      transaction,
    });

    // Obtener el post
    const post = await Posts.findByPk(postId, { transaction });

    // Obtener el usuario asociado al post
    const user = await Users.findByPk(post.UserId, { transaction });

    // Obtener el dare asociado al post para saber los puntos
    const dare = await Dares.findByPk(post.DareId, { transaction });

    if (ratings.length > 0) {
      const totalRatings = ratings.reduce(
        (sum, rating) => sum + rating.ratingValue,
        0
      );
      const averageRating = totalRatings / ratings.length;

      // Actualizar el averageRating del post
      await post.update({ averageRating: averageRating }, { transaction });

      if (averageRating > 2.5 && !post.pointsAwarded) {
        // Otorgar puntos al usuario
        const newTotalPoints = user.totalPoints + dare.points;
        await user.update({ totalPoints: newTotalPoints }, { transaction });

        // Marcar el post como puntos otorgados
        await post.update({ pointsAwarded: true }, { transaction });
      } else if (averageRating <= 2.5 && post.pointsAwarded) {
        // Restar puntos al usuario
        const newTotalPoints = user.totalPoints - dare.points;
        await user.update(
          { totalPoints: newTotalPoints >= 0 ? newTotalPoints : 0 },
          { transaction }
        );

        // Marcar el post como puntos no otorgados
        await post.update({ pointsAwarded: false }, { transaction });
      }
    } else {
      // Si no hay calificaciones, establecer averageRating a 0
      await post.update({ averageRating: 0 }, { transaction });

      if (post.pointsAwarded) {
        // Restar puntos al usuario
        const newTotalPoints = user.totalPoints - dare.points;
        await user.update(
          { totalPoints: newTotalPoints >= 0 ? newTotalPoints : 0 },
          { transaction }
        );

        // Marcar el post como puntos no otorgados
        await post.update({ pointsAwarded: false }, { transaction });
      }
    }
  } catch (error) {
    console.error("Error updating average rating:", error);
    throw error; // Asegurarse de que la transacción se deshaga en caso de error
  }
};

// GET route para obtener todas las calificaciones del usuario logueado
router.get("/", validateToken, async (req, res) => {
  const UserId = req.user.id;

  try {
    const userRatings = await Ratings.findAll({
      where: { UserId: UserId },
    });

    res.json(userRatings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET route para obtener la calificación del usuario para un post específico
router.get("/:postId", validateToken, async (req, res) => {
  const UserId = req.user.id;
  const postId = req.params.postId;

  try {
    const userRating = await Ratings.findOne({
      where: { UserId: UserId, PostId: postId },
    });

    res.json(userRating);
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
