import React, { useState, useRef, useEffect } from "react";
import SocketIO from "socket.io-client";
import { usePlayerName } from "../contexts/playerName";
import SelectPlayerName from "../components/SelectPlayerName";
import PlayerName from "../components/PlayerName";
import { ButtonLink } from "../components/Button";
import List from "../components/List";
import styled from "@emotion/styled";
import GameListItem from "../components/GameListItem";

const Container = styled.div`
  padding: 10px;
  width: 100%;
`;

function Games() {
  const socketRef = useRef(null);
  const [games, setGames] = useState([]);
  const [playerName] = usePlayerName();

  useEffect(() => {
    if (!playerName) {
      return;
    }

    socketRef.current = SocketIO();
    function handleListGames(games) {
      setGames(games);
    }

    socketRef.current.on("list games", handleListGames);
    socketRef.current.emit("list games");

    return () => {
      socketRef.current.off(handleListGames);
    };
  }, [playerName]);

  if (!playerName) {
    return <SelectPlayerName />;
  }

  return (
    <Container>
      <p>
        Hello, <PlayerName>{playerName}</PlayerName>,<br />
        join or open a game.
      </p>
      <ButtonLink href={`/games/${socketRef.current?.id}`}>
        Open Game
      </ButtonLink>
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
