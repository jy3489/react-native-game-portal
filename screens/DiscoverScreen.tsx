import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// A small local catalog is all we need for the first demo.
const games = [
  {
    name: 'Tic-Tac-Toe', players: '2 players', symbol: 'X O',
    description: 'A quick classic. Take turns and line up three marks to win.',
    color: '#e8efff', available: true,
  },
  {
    name: 'Poker', players: '2–6 players', symbol: '♠',
    description: 'Read the table, build your hand, and enjoy a friendly card game.',
    color: '#fceee9', available: false,
  },
  {
    name: 'Chinese Checkers', players: '2–6 players', symbol: '◎',
    description: 'Hop across the board and race your pieces to the opposite corner.',
    color: '#e8f4ef', available: false,
  },
];


type Props = { search: string; onSearch: (value: string) => void; onChooseMode: () => void };

export default function DiscoverScreen({ search, onSearch, onChooseMode }: Props) {
  const query = search.trim().toLowerCase();
  const visibleGames = games.filter(game => game.name.toLowerCase().includes(query));
  return (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Text style={styles.brand} accessibilityRole="header">GamePortal</Text>
          <Text style={styles.eyebrow}>DISCOVER</Text>
          <Text style={styles.heading} accessibilityRole="header">What would you like to play?</Text>
          <Text style={styles.subtitle}>Find a game. Bring a friend. Have some fun.</Text>

          <TextInput
            style={styles.search}
            placeholder="Search games"
            placeholderTextColor="#64748b"
            accessibilityLabel="Search games"
            value={search}
            onChangeText={onSearch}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />

          <View style={styles.cards}>
            {visibleGames.map(game => (
              <View key={game.name} style={styles.card}>
                <View style={[styles.art, { backgroundColor: game.color }]}>
                  <Text style={styles.symbol} accessible={false}>{game.symbol}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.gameName} accessibilityRole="header">{game.name}</Text>
                  <Text style={styles.players}>{game.players}</Text>
                  <Text style={styles.description}>{game.description}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={game.available ? 'Choose Mode for Tic-Tac-Toe' : game.name + ' coming soon'}
                    disabled={!game.available}
                    onPress={onChooseMode}
                    style={({ pressed }) => [
                      styles.button,
                      !game.available && styles.disabledButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={[styles.buttonText, !game.available && styles.disabledText]}>
                      {game.available ? 'Choose Mode' : 'Coming soon'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
          {visibleGames.length === 0 && (
            <Text style={styles.empty}>No games found. Try another name.</Text>
          )}
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f8fc' },
  content: { width: '100%', maxWidth: 1000, alignSelf: 'center', padding: 24, paddingBottom: 48 },
  brand: { fontSize: 24, fontWeight: '800', color: '#1e3a8a', marginBottom: 40 },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 2, color: '#64748b', marginBottom: 10 },
  heading: { fontSize: 30, fontWeight: '700', color: '#172033', marginBottom: 10 },
  subtitle: { fontSize: 16, lineHeight: 24, color: '#64748b', marginBottom: 24 },
  search: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#172033', marginBottom: 28, minHeight: 48 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  card: { flexGrow: 1, flexBasis: 270, maxWidth: '100%', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, backgroundColor: '#fff', overflow: 'hidden' },
  art: { height: 120, alignItems: 'center', justifyContent: 'center' },
  symbol: { fontSize: 48, fontWeight: '700', color: '#334155' },
  cardBody: { padding: 20, flex: 1 },
  gameName: { fontSize: 21, fontWeight: '700', color: '#172033' },
  players: { fontSize: 14, color: '#475569', marginTop: 8 },
  description: { fontSize: 15, lineHeight: 23, color: '#64748b', marginTop: 12, marginBottom: 24, flexGrow: 1 },
  button: { minHeight: 48, borderRadius: 10, backgroundColor: '#2855c5', alignItems: 'center', justifyContent: 'center', padding: 12 },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  disabledButton: { backgroundColor: '#edf1f7' },
  disabledText: { color: '#64748b' },
  pressed: { opacity: 0.8 },
  empty: { fontSize: 16, color: '#64748b', textAlign: 'center', paddingVertical: 32 },
});



