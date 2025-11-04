
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login_form");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page refresh

    // Get form data only when button is clicked
    const loginData = {
      email: document.getElementById("username").value.trim(),
      password: document.getElementById("password").value.trim(),
      keeplog: document.getElementById("f-option2").checked ? "yes" : "no",
    };

    console.log("📤 Sending to backend:", loginData);

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        alert("✅ Login successful!");

        // Redirect to index.html if 'Keep me logged in' is checked
        localStorage.setItem("user", JSON.stringify(loginData));
        localStorage.setItem("customerProfile", JSON.stringify(result.data));
        window.location.href = "cart.html";
      } else {
        alert(`❌ ${result.message || "Invalid credentials"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Server error — please try again later.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("sign_in_form");

  if (!signInForm) return;

  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Check if the "Keep me logged in" checkbox is selected
    const keepLoggedIn = document.getElementById("f-option2").checked ? "yes" : "no";

    const loginData = {
      fname: document.getElementById("fname").value.trim(),
      lname: document.getElementById("lname").value.trim(),
      email: document.getElementById("username").value.trim(),
      password: document.getElementById("password").value.trim(),
      keepLoggedIn, // send to backend
    };

    console.log("📤 Sending to backend:", loginData);

    try {
      const response = await fetch("http://localhost:5001/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log("📥 Backend response:", result);

      if (response.ok && result.success) {
        alert("✅ Account created successfully!");

        // Save login state if "Keep me logged in" is checked
        if (keepLoggedIn === "yes") {
          localStorage.setItem("user", JSON.stringify(loginData));
          localStorage.setItem("customerProfile", JSON.stringify(result.data));
          // Redirect to index.html after short delay
          window.location.href = "index.html";
        } else {
          sessionStorage.setItem("userSession", JSON.stringify(loginData));
          localStorage.setItem("customerProfile", JSON.stringify(result.data));
          // Still redirect but without persistent storage
          window.location.href = "index.html";
        }

        signInForm.reset();
      } else {
        alert(`❌ ${result.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Server error — please try again later.");
    }
  });
});

