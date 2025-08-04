function onNavbarLoaded() {
                const span = document.getElementById('nav-username');
                const username = document.getElementById('username');
                const email = document.getElementById('email');
                const joined = document.getElementById('joined');
                const hmap = document.getElementById('heatmap');
                if (span) span.textContent = '…loading…';

                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'http://localhost/Coders_Battleground/Server/profile.php', true);
                xhr.withCredentials = true;
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        const resp = JSON.parse(xhr.responseText);
                        // console.log(resp);
                        // replace username
                        if (span && resp.user) span.textContent = resp.user.name;

                        username.textContent = resp.user.name;
                        email.textContent = resp.user.email;
                        joined.textContent = `Joined: ${resp.user.created_at}`;
                        heatmap(hmap, resp.submissions);

                        const langContainer = document.getElementById('languages-container');
                        langContainer.innerHTML = '';
                        resp.languages.forEach(l => {
                            const badge = document.createElement('span');
                            badge.className = 'badge bg-primary me-3 mb-3 fs-6';
                            badge.textContent = l;
                            langContainer.appendChild(badge);

                        })

                        const act = document.getElementById('list-activities');
                        act.innerHTML = '';

                        resp.activities.forEach((a, index) => {
                            const li = document.createElement('li');
                            li.className = index % 2 === 0
                                ? 'list-group-item'
                                : 'list-group-item list-group-item-secondary';

                            li.innerHTML = `Solved <strong>${a.problem_title}</strong> in <em>${a.contest_name}</em>`;
                            act.appendChild(li);
                        });

                        const { points, solved, totals } = resp.chart;

                        //total points (for center percent) and total possible points
                        const totalEarnedPoints = points.Easy + points.Medium + points.Hard;
                        const totalProblems = totals.Easy + totals.Medium + totals.Hard;

                        includeHtml('chart', '../components/circle-progress.html', () => {
                            getChart("circleChart", {
                                easy: resp.chart.solved.Easy,
                                medium: resp.chart.solved.Medium,
                                hard: resp.chart.solved.Hard,
                                total: totalProblems
                            });

                            //max possible points from points_dists
                            const pd = resp.point_pd; // { easy:5, medium:15, hard:25 }
                            const maxPoints = totals.Easy * pd.Easy
                                + totals.Medium * pd.Medium
                                + totals.Hard * pd.Hard;

                            const solvedTotal = solved.Easy + solved.Medium + solved.Hard;
                            const available = totals.Easy + totals.Medium + totals.Hard;
                            const percentSolved = Math.round(solvedTotal / available * 100);

                            const e = Number(points.Easy);
                            const m = Number(points.Medium);
                            const h = Number(points.Hard);
                            const earned = e + m + h;


                            document.querySelector(".center-label").innerHTML = `
                            <div>${percentSolved}%</div>
                            <small>Points: ${earned}</small>
                        `;
                            document.getElementById('easy-count').textContent = `${solved.Easy}/${totals.Easy}`;
                            document.getElementById('medium-count').textContent = `${solved.Medium}/${totals.Medium}`;
                            document.getElementById('hard-count').textContent = `${solved.Hard}/${totals.Hard}`;
                        });


                    }
                    else if (xhr.status === 401) {
                        window.location.href = '/pages/login_signup.html';
                    }
                };
                xhr.send(JSON.stringify({}));
            }

            document.addEventListener('DOMContentLoaded', () => {
                includeHtml(
                    'navbar-placeholder',
                    '../components/navbar.html',
                    onNavbarLoaded
                );
            });

 window.addEventListener("load", function () {
                fetch("http://localhost/Coders_Battleground/Server/get_image.php", {
                    method: "GET",
                    credentials: "include"
                })
                    .then(res => res.json())
                    .then(data => {
                        const imgEl = document.getElementById("profile-pic");
                        if (imgEl) {
                            if (data.image_url) {
                                imgEl.src = data.image_url;
                            } else {
                                imgEl.src = "../assets/images/placeholder-profile-pic.jpg";
                            }
                        }
                    })
                    .catch(err => {
                        console.error("Error loading profile picture:", err);
                    });
            });