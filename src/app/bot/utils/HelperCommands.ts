import dotenv from 'dotenv';

dotenv.config();

export const HelperCommands = {
  checkIfIsAdmin(message_from: string): boolean {
    if (process.env.ADMINS != null) {
      const admins = process.env.ADMINS.split(' ');

      if (admins.indexOf(message_from) > -1) {
        return true;
      }
    }

    return false;
  },
};
