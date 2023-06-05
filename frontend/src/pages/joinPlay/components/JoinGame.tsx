import { Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { joinGameApi } from '../../../http/apis/player';
import { JoinGameResponseModal } from '../../../http/apis/player/types';

interface Props {
  sessionId: string;
}

const UnJoin: React.FC<Props> = (props: Props) => {
  const [playerName, setPlayerName] = useState<string>('');
  const { sessionId } = props;
  const handleJoinGame = async () => {
    if (!playerName) {
      message.error('Please enter a nickname');
      return;
    }
    if (sessionId) {
      try {
        const res: JoinGameResponseModal = await joinGameApi(
          sessionId,
          playerName
        );
        // setPlayerId(res.playerId);
        localStorage.setItem('playerId', JSON.stringify(res.playerId));
        localStorage.setItem('playerName', JSON.stringify(playerName));
      } catch (error) {
        message.error('Failed to join the game');
      }
    }
  };

  return (
    <div className="p-6 opacity-50 w-80 bg-slate-700 rounded-xl">
      <Input
        placeholder="Give me a name"
        value={playerName}
        onChange={(e) => {
          setPlayerName(e.target.value);
        }}
        className="w-full p-4 text-xl text-black"
      ></Input>
      <Button
        size="large"
        type="primary"
        className="w-full mt-6 bg-blue-600"
        onClick={handleJoinGame}
      >
        Join the Game
      </Button>
    </div>
  );
};

export default UnJoin;
