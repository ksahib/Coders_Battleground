
  const problems = [
    { id: 1, title: "Two Sum", difficulty: "Easy", acceptance: "48.2%" },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", acceptance: "38.4%" },
    { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", acceptance: "33.6%" },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "29.4%" },
    { id: 5, title: "Valid Parentheses", difficulty: "Easy", acceptance: "41.5%" },
  ];
  // Generate Problems List
  const $tableBody = $('#problem-list');
  problems.forEach(problem => {
    const row = `
      <tr>
        <th scope="row">${problem.id}</th>
        <td><a href="Problem_desc.html" class="text-decoration-none text-info">${problem.title}</a></td>
        <td>
          <span class="badge ${
            problem.difficulty === 'Easy' ? 'bg-success' :
            problem.difficulty === 'Medium' ? 'bg-warning text-dark' :
            'bg-danger'
          }">${problem.difficulty}</span>
        </td>
        <td>${problem.acceptance}</td>
      </tr>
    `;
    $tableBody.append(row);
  });
   
  // Content Card Section
   $(document).ready(function () {
        const $container = $('#cards-row-feature');

        $container.append(createContentCard('Interview', 'Google <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #1E90FF 0%, #00FF85 100%)'));
        $container.append(createContentCard('Interview', 'Amazon <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)'));
        $container.append(createContentCard('Interview', 'Microsoft <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'));
        $container.append(createContentCard('Interview', 'Apple <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)'));
        $container.append(createContentCard('Interview', 'Netflix <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 50%, #6dd5ed 100%)'));
        $container.append(createContentCard('Interview', 'Conda <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)'));
        $container.append(createContentCard('Interview', 'Nvidia <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'));
        $container.append(createContentCard('Interview', 'Linux <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #29323c 0%, #485563 100%)'));
    });

  //  Problem Type Tag Section
     const tags = [
    "Array", "Linked List", "Hash Table", "String", "Math", "Greedy", "Dynamic Programming",
    "Backtracking", "Stack", "Queue", "Heap", "Tree", "Graph", "DFS", "BFS",
    "Binary Search", "Recursion", "Sliding Window", "Bit Manipulation", "Two Pointers",
    "Union Find", "Trie", "Topological Sort", "Segment Tree", "Monotonic Stack"
  ];
    $(document).ready(function(){
        const $container=$("#tag_holder_row")
        tags.forEach(tag=>{
            const $tagelement=$(`<div id="tag_card">${tag}</div>`)
            $container.append($tagelement)

        })
    })
