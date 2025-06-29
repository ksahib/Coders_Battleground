// Wait until the DOM is fully loaded
$(document).ready(function () {
  const problemData = {
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: "45%",
    description: `
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
      <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
      <p>You can return the answer in any order.</p>

      <h4>Example:</h4>
      <pre><code>Input: nums = [2,7,11,15], target = 9  
Output: [0,1]</code></pre>

      <h4>Constraints:</h4>
      <ul>
        <li><code>2 ≤ nums.length ≤ 10⁴</code></li>
        <li><code>-10⁹ ≤ nums[i] ≤ 10⁹</code></li>
        <li><code>-10⁹ ≤ target ≤ 10⁹</code></li>
        <li>Only one valid answer exists.</li>
      </ul>
    `
  };

  // Populate fields using jQuery
  $('#problem-title').text(problemData.title);
  $('#problem-difficulty')
    .text(problemData.difficulty)
    .addClass(problemData.difficulty.toLowerCase()); // add class 'easy', 'medium', or 'hard'

  $('#problem-acceptance').text(`Acceptance: ${problemData.acceptance}`);
  $('#problem-description').html(problemData.description);
});
