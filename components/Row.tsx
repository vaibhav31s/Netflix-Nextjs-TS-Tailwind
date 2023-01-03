import { Movie } from "../typing";

interface Props {
    title: string;
    Movies: Movie[];
}
const Row = ({title, Movies}: Props) => {
  return (
    <div>Row</div>
  )
}

export default Row