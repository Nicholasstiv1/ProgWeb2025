import { cleanEnv, str, port } from 'envalid';

export default function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    LOGS_PATH: str()
  });
}
