/**
 * Tests the response time of a given URL over multiple iterations.
 * 
 * This function measures the time taken for a GET request to complete
 * and calculates the average response time over successful requests.
 * It also logs the number of successful and failed attempts.
 *
 * @param {string} url - The URL to test.
 * @param {number} [iterations=1] - The number of times to test the URL.
 * @returns {Promise<void>} - Logs the results to the console.
 */
async function testResponseTime(url, iterations = 1) {
    let totalTime = 0;
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        try {
            const response = await fetch(url, { method: 'GET', cache: 'no-cache' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const endTime = performance.now();
            totalTime += (endTime - startTime);
            successCount++;
        } catch (error) {
            console.error(`Iteration ${i + 1}: Error fetching the URL:`, error.message);
            failureCount++;
        }
    }
    
    if (successCount > 0) {
        const averageTime = totalTime / successCount;
        console.log(`Average response time for ${url} over ${successCount} successful iterations: ${averageTime.toFixed(2)} ms`);
    } else {
        console.log(`All ${iterations} requests failed.`);
    }
    
    console.log(`Total successful requests: ${successCount}`);
    console.log(`Total failed requests: ${failureCount}`);
}

// Replace with your webpage URL and number of iterations
testResponseTime('https://cvagent-b8c3fb279d06.herokuapp.com/', 1000);
