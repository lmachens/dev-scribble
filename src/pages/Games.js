import React, { useState, useEffect } from "react";
import { usePlayerName } from "../contexts/playerName";
import SelectPlayerName from "../components/SelectPlayerName";
import PlayerName from "../components/PlayerName";
import { ButtonLink } from "../components/Button";
import List from "../components/List";
import styled from "@emotion/styled";
import GameListItem from "../components/GameListItem";
import { useSocket } from "../contexts/socket";

const Container = styled.div`
  padding: 10px;
  width: 100%;
`;

function Games() {
  const socket = useSocket();
  const [games, setGames] = useState([]);
  const [playerName] = usePlayerName();

  useEffect(() => {
    if (!playerName || !socket) {
      return;
    }

    function handleListGames(games) {
      setGames(games);
    }

    socket.on("list games", handleListGames);
    socket.emit("list games");

    return () => {
      socket.off(handleListGames);
    };
  }, [playerName, socket]);

  if (!playerName) {
    return <SelectPlayerName />;
  }

  return (
    <Container>
      <p>
        Hello, <PlayerName>{playerName}</PlayerName>,<br />
        join or open a game.
      </p>
      <ButtonLink href={`/games/${socket?.id}`}>Open Game</ButtonLink>
      <h2>Open Games</h2>
      <List>
        {games.length === 0 && <div>No games found</div>}
        {games.map((game) => (
          <GameListItem key={game.gameId} game={game} />
        ))}
      </List>
    </Container>
  );
}

export default Games;
