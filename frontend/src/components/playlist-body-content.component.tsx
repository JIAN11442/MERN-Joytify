import SongsList from "./songs-list.component";
import { RefactorPlaylistResponse } from "@joytify/shared-types/types";

type PlaylistBodyContentProps = {
  playlist: RefactorPlaylistResponse;
};

const PlaylistBodyContent: React.FC<PlaylistBodyContentProps> = ({ playlist }) => {
  const { songs } = playlist;

  return (
    <div
      className={`
        mt-5
        overflow-x-hidden
      `}
    >
      <SongsList songs={songs} />
    </div>
  );
};

export default PlaylistBodyContent;
