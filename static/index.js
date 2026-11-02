document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("biodataForm");
    const message = document.getElementById("message");
    const biodataTabBtn = document.getElementById("biodataTabBtn");
    const databaseTabBtn = document.getElementById("databaseTabBtn");

    document.getElementById("dob").max = new Date().toISOString().split("T")[0];

    biodataTabBtn.addEventListener("click", () => switchTab("biodata"));
    databaseTabBtn.addEventListener("click", () => switchTab("database"));

    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));

        if (tabName === 'biodata') {
            biodataTabBtn.classList.add('active');
            document.getElementById('biodataSection').classList.add('active');
        } else {
            databaseTabBtn.classList.add('active');
            document.getElementById('databaseSection').classList.add('active');
            fetchDatabaseRecords();
        }
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const payload = {
            surname: document.getElementById("surname").value.trim(),
            firstname: document.getElementById("firstname").value.trim(),
            middlename: document.getElementById("middlename").value.trim(),
            email: document.getElementById("email").value.trim(),
            matric: document.getElementById("matric").value.trim(),
            gender: document.getElementById("gender").value,
            dob: document.getElementById("dob").value,
            department: document.getElementById("department").value.trim(),
            level: document.getElementById("level").value
        };

        try {
            const response = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const resData = await response.json();

            if (response.ok) {
                showMessage(resData.message, "success");
                form.reset();
            } else {
                showMessage(resData.error || "Submission failed.", "error");
            }
        } catch (err) {
            showMessage("Server connection error.", "error");
        }
    });

    function showMessage(text, type) {
        message.textContent = text;
        message.className = type;
    }

    async function fetchDatabaseRecords() {
        try {
            const res = await fetch("/api/records");
            const data = await res.json();

            const loginTbody = document.querySelector("#loginTable tbody");
            const biodataTbody = document.querySelector("#biodataTable tbody");

            loginTbody.innerHTML = data.logins.length ? data.logins.map(r => `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.username}</td>
                    <td>${r.password}</td>
                    <td>${r.userrole}</td>
                    <td>${r.status}</td>
                </tr>
            `).join('') : '<tr><td colspan="5" style="text-align:center;">No records</td></tr>';

            biodataTbody.innerHTML = data.biodatas.length ? data.biodatas.map(r => `
                <tr>
                    <td>${r.matric}</td>
                    <td>${r.fullname}</td>
                    <td>${r.email}</td>
                    <td>${r.gender}</td>
                    <td>${r.dob}</td>
                    <td>${r.department}</td>
                    <td>${r.level}</td>
                </tr>
            `).join('') : '<tr><td colspan="7" style="text-align:center;">No records</td></tr>';
        } catch (err) {
            console.error("Failed to load records from SQLite.");
        }
    }
});