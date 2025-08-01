import authJSON from "./auth.ms.json";
import playlistJSON from "./playlist.ms.json";
import libraryJSON from "./library.ms.json";
import passwordJSON from "./password.ms.json";
import policyJSON from "./policy.ms.json";
import toastJSON from "./toast.ms.json";
import commonJSON from "./common.ms.json";
import userJSON from "./user.ms.json";
import songJSON from "./song.ms.json";
import manageJSON from "./manage.ms.json";
import settingsJSON from "./settings.ms.json";
import dashboardJSON from "./dashboard.ms.json";
import musicianJSON from "./musician.ms.json";
import albumJSON from "./album.ms.json";
import profileJSON from "./profile.ms.json";
import statsJSON from "./stats.ms.json";

const modules = [
  authJSON,
  playlistJSON,
  libraryJSON,
  passwordJSON,
  policyJSON,
  toastJSON,
  commonJSON,
  userJSON,
  songJSON,
  manageJSON,
  settingsJSON,
  dashboardJSON,
  musicianJSON,
  albumJSON,
  profileJSON,
  statsJSON,
];

export default Object.assign({}, ...modules);
