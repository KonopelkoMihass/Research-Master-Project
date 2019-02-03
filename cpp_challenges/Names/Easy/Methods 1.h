class AudioManager
{
public:
	static AudioManager* me;
	static AudioManager* getAudioManager();
	AudioManager(void);
	~AudioManager(void);

	void playCannon(void);
	void playCrack(void);
	void playPickup(void);

private:
	map<AudioStream*, string> m_soundCollection{};
	play_sound(string name);
	play_sound_looped(string name);
	stop_sound();
};