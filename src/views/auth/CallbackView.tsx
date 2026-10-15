import { SessionTokenStorage } from 'api/core/plugins';
import { Navigate } from 'react-router-dom';
import { client, Keys } from 'stores';

export function CallbackView() {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const token = fragment.get('token')?.trim();

  if (token) {
    sessionStorage.setItem(SessionTokenStorage, token);
    // Remove any legacy persistent copy so it cannot remain after a new login.
    localStorage.removeItem('ios-session-token');
    client.setQueryData(Keys.login, token);
    client.invalidateQueries(Keys.login);
  }

  return <Navigate to="/home" replace />;
}
