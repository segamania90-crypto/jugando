import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'favorites'), where('uid', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => docSnap.data());
      setFavorites(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const isFavorite = useCallback(
    (gameId) => favorites.some((f) => f.gameId === String(gameId)),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (game) => {
      if (!user) return;

      const favoriteId = `${user.uid}_${game.id}`;
      const favoriteRef = doc(db, 'favorites', favoriteId);

      if (isFavorite(game.id)) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, {
          uid: user.uid,
          gameId: String(game.id),
          name: game.name,
          background_image: game.background_image,
          rating: game.rating ?? null,
          genres: game.genres ? game.genres.map((g) => g.name) : [],
        });
      }
    },
    [user, isFavorite]
  );

  return { favorites, loading, isFavorite, toggleFavorite };
}