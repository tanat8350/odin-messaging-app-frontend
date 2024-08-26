import api from '../configs/api';

export default function updateLastRequest(user) {
  try {
    api.put(`/user/${user.id}/request`);
  } catch {}
}
