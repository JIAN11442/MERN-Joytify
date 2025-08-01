import authJSON from "./auth.zh-TW.json";
import playlistJSON from "./playlist.zh-TW.json";
import libraryJSON from "./library.zh-TW.json";
import passwordJSON from "./password.zh-TW.json";
import policyJSON from "./policy.zh-TW.json";
import toastJSON from "./toast.zh-TW.json";
import commonJSON from "./common.zh-TW.json";
import userJSON from "./user.zh-TW.json";
import songJSON from "./song.zh-TW.json";
import manageJSON from "./manage.zh-TW.json";
import settingsJSON from "./settings.zh-TW.json";
import dashboardJSON from "./dashboard.zh-TW.json";
import musicianJSON from "./musician.zh-TW.json";
import albumJSON from "./album.zh-TW.json";
import profileJSON from "./profile.zh-TW.json";
import statsJSON from "./stats.zh-TW.json";

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
