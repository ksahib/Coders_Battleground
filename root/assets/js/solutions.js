$(document).ready(function () {
  const dummySolutions = [
    {
      user: "user123",
      language: "Python",
      votes: 52,
      code: `def twoSum(nums, target):\n    hashmap = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in hashmap:\n            return [hashmap[diff], i]\n        hashmap[num] = i`
    },
    {
      user: "coder_zen",
      language: "C++",
      votes: 35,
      code: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int diff = target - nums[i];\n        if (map.count(diff)) return {map[diff], i};\n        map[nums[i]] = i;\n    }\n    return {}; \n}`
    },
    {
      user: "jsDev77",
      language: "JavaScript",
      votes: 28,
      code: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n}`
    }
  ];
  // Generate Solutions dynamically
  dummySolutions.forEach(sol => {
    const solutionHTML = `
      <div class="solution-card">
        <div class="solution-meta">
          <div><strong>${sol.language}</strong> solution by <em>${sol.user}</em></div>
          <div><i class="fas fa-thumbs-up"></i> ${sol.votes}</div>
        </div>
        <div class="solution-code">${sol.code.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")}</div>
      </div>
    `;
    $("#solutions-list").append(solutionHTML);
  });
});
