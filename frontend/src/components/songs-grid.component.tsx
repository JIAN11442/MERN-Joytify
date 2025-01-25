import { RefactorResSong } from "../constants/axios-response.constant";

type SongsGridProps = {
  songs: RefactorResSong[];
};

const SongsGrid: React.FC<SongsGridProps> = ({ songs }) => {
  return <div>{songs.map((song) => song.title)}</div>;
};

export default SongsGrid;
