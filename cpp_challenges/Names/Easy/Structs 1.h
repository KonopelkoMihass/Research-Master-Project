// This struct will store data regarding position
struct Position {
public:
  float x{0};
  float y{0};
  float z{0};

  const Vector3 getVector();
  const Vector3 setVector(float t_x, float t_y, float t_z);
};

// This struct will store data regarding scale.
struct Scale {
public:
  float scaleX{1};
  float scaleY{1};
  float scaleZ{1};
};