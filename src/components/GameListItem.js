import React from "react";
import ListItem from "./ListItem";
import ListItemLink from "./ListItemLink";
import PlayerName from "./PlayerName";
import styled from "@emotion/styled";

const PaddingListItemLink = styled(ListItemLink)`
  padding: 10px;
`;

const Players = styled.div`
  > * {
    margin: 4px;
  }
`;

function GameListItem({ game }) {
  return (
    <ListItem key={game.gameId}>
      <PaddingListItemLink href={`/games/${game.gameId}`}>
        <Players>
          {game.players.map((player) => (
            <PlayerName key={player.id}>{player.name}</PlayerName>
          ))}
        </Players>
        <span>Join Game</span>
      </PaddingListItemLink>
    </ListItem>
  );
}

export default GameListItem;
