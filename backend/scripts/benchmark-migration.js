
async function mockSupabaseRpc(name, params, latency = 50) {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, latency));
  return { data: null, error: null };
}

async function benchmark() {
  const statementCount = 50;
  const statements = Array(statementCount).fill("CREATE TABLE test_table (id UUID);");
  const fullMigrationSQL = statements.join('\n');
  const LATENCY = 50; // 50ms simulated latency per request

  console.log(`🚀 Benchmarking ${statementCount} SQL statements with ${LATENCY}ms simulated latency...\n`);

  // --- N+1 Strategy ---
  console.log('--- N+1 Strategy (Current) ---');
  const startNPlus1 = Date.now();
  for (let i = 0; i < statements.length; i++) {
    // Simulate what run-migration.js does
    await mockSupabaseRpc('exec_sql', { sql: statements[i] }, LATENCY);
  }
  const endNPlus1 = Date.now();
  const durationNPlus1 = endNPlus1 - startNPlus1;
  console.log(`Total time for N+1: ${durationNPlus1}ms`);

  // --- Batched Strategy ---
  console.log('\n--- Batched Strategy (Optimized) ---');
  const startBatched = Date.now();
  await mockSupabaseRpc('exec_sql', { sql: fullMigrationSQL }, LATENCY);
  const endBatched = Date.now();
  const durationBatched = endBatched - startBatched;
  console.log(`Total time for Batched: ${durationBatched}ms`);

  // --- Results ---
  const improvement = durationNPlus1 - durationBatched;
  const percentage = ((improvement / durationNPlus1) * 100).toFixed(2);

  console.log('\n--- Results ---');
  console.log(`Baseline (N+1): ${durationNPlus1}ms`);
  console.log(`Optimized (Batched): ${durationBatched}ms`);
  console.log(`Improvement: ${improvement}ms (${percentage}%)`);
}

benchmark().catch(console.error);
