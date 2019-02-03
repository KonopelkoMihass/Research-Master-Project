// This struct will store data regarding an NPC called Merchant.
struct Merchant {
public:
	Vector2 position{0, 0};
	int gold{0};
	int[] itemSoldID{0, 1};
	int healthPoints{100};
	string type{"General"};
};

// This struct will store data regarding an enemy called Minotaur.
struct Minotaur {
public:
	Vector2 position{0, 0};
	float damage{1};
	float speed{1};
	int healthPoints{500};

  const Vector3 getPosition();
  void attack(string t_targetName);
  void move(char t_direction, int t_squares);
};