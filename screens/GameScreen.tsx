// screens/GameScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const GRID_SIZE = 20;
const CELL_SIZE = Dimensions.get('window').width / GRID_SIZE;

type Position = {
  x: number;
  y: number;
};

const getRandomPosition = (): Position => {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
};

const GameScreen: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>(getRandomPosition());
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    const newSnake = [...snake];
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Verifica colisión con los bordes
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setIsGameOver(true);
      return;
    }

    // Verifica colisión con sí mismo
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Verifica si la serpiente come la comida
    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomPosition());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [direction, food, snake, isGameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const handleGesture = (newDirection: Position) => {
    if (
      (newDirection.x !== -direction.x || newDirection.y !== -direction.y) && !isGameOver
    ) {
      setDirection(newDirection);
    }
  };

  const handleRestart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition());
    setDirection({ x: 1, y: 0 });
    setIsGameOver(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juego del Gusanito</Text>
      <View style={styles.gameArea}>
        {snake.map((segment, index) => (
          <View
            key={index}
            style={[
              styles.snakeSegment,
              { left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE },
            ]}
          />
        ))}
        <View
          style={[
            styles.food,
            { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE },
          ]}
        />
        {isGameOver && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>¡Juego Terminado!</Text>
            <TouchableOpacity onPress={handleRestart}>
              <Text style={styles.restartText}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => handleGesture({ x: 0, y: -1 })} style={styles.controlButton}>
          <Text style={styles.controlText}>Arriba</Text>
        </TouchableOpacity>
        <View style={styles.horizontalControls}>
          <TouchableOpacity onPress={() => handleGesture({ x: -1, y: 0 })} style={styles.controlButton}>
            <Text style={styles.controlText}>Izquierda</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleGesture({ x: 1, y: 0 })} style={styles.controlButton}>
            <Text style={styles.controlText}>Derecha</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleGesture({ x: 0, y: 1 })} style={styles.controlButton}>
          <Text style={styles.controlText}>Abajo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282C34',
  },
  title: {
    fontSize: 32,
    color: '#61DAFB',
    marginBottom: 20,
  },
  gameArea: {
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE,
    backgroundColor: '#000',
    position: 'relative',
  },
  snakeSegment: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#61DAFB',
    position: 'absolute',
  },
  food: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'red',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  gameOverText: {
    fontSize: 32,
    color: 'white',
    marginBottom: 20,
  },
  restartText: {
    fontSize: 24,
    color: '#61DAFB',
  },
  controls: {
    marginTop: 40,
  },
  controlButton: {
    backgroundColor: '#61DAFB',
    padding: 20,
    margin: 5,
    borderRadius: 10,
  },
  controlText: {
    fontSize: 18,
    color: '#282C34',
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default GameScreen;
