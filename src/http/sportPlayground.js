import { $host } from "."

export const getAllPlaygrounds = async (tlLat, tlLng, brLat, brLng) => {
  const { data } = await $host.get('/api/playgrounds', {
    params: {tlLat, tlLng, brLat, brLng},
  });

  return data;
};
