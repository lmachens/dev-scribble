import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import PlayerName from "../components/PlayerName";
import styled from "@emotion/styled";
import { ButtonLink } from "../components/Button";

const BlockPlayerName = styled(PlayerName)`
  display: block;
`;

function sortByPoints(a, b) {
  return b.points - a.points;
}
function PastGame() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetch(`/api/games/${gameId}`)
      .then((response) => response.json())
      .then(setGame);
  }, [gameId]);

  if (!game) {
    return <div>Loading...</div>;
  }
  const playersByPoints = game.players.sort(sortByPoints);
  return (
    <div>
      {playersByPoints.map((player) => (
        <BlockPlayerName key={player.id}>
          {player.points}: {player.name}
        </BlockPlayerName>
      ))}
      <ButtonLink href="/games">Back to games</ButtonLink>
    </div>
  );
}

export default PastGame;
