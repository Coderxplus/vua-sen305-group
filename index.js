const form = document.getElementById("biodataForm");
        const message = document.getElementById("message");

        // Prevent selecting a future date of birth
        document.getElementById("dob").max =
            new Date().toLocaleDateString("en-CA");

        form.addEventListener("submit", function(event) {
            event.preventDefault();

            const surname =
                document.getElementById("surname").value.trim();

            const firstname =
                document.getElementById("firstname").value.trim();

            const middlename =
                document.getElementById("middlename").value.trim();


            const email =
                document.getElementById("email").value.trim();

            const matric =
                document.getElementById("matric").value.trim();

            const dob =
                document.getElementById("dob").value;

            // Check that the name contains at least two words
            if (surname === "") {
                showMessage(
                    "Please enter your first name and surname.",
                    "error"
                );
                return;
            }

            if (firstname === "") {
                showMessage(
                    "Please enter your first name and surname.",
                    "error"
                );
                return;
            }

            if (middlename === "") {
                showMessage(
                    "Please enter your first name and surname.",
                    "error"
                );
                return;
            }

            // Check that the matric number is not empty
            if (matric.length < 3) {
                showMessage(
                    "Please enter a valid matric number.",
                    "error"
                );
                return;
            }

            // Check that the date of birth is valid
            if (!dob || new Date(dob) >= new Date(
                new Date().toLocaleDateString("en-CA")
            )) {
                showMessage(
                    "Please enter a valid date of birth.",
                    "error"
                );
                return;
            }

            // Check the email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );
                return;
            }

            // If all checks pass
            showMessage(
                "Biodata submitted successfully!",
                "success"
            );

            console.log({
                fullname: surname +" " +firstname+ " " + middlename,
                email: email,
                matric: matric,
                gender: document.getElementById("gender").value,
                dob: dob,
                department: document.getElementById("department").value,
                level: document.getElementById("level").value
            });
        });

        function showMessage(text, type) {
            message.textContent = text;
            message.className = type;
        }