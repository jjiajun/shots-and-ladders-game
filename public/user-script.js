$(document).ready(function () {
  $("#formSubmit").click(async (e) => {
    JsLoadingOverlay.show();
    e.preventDefault();
    const name = $("#name").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const body = { name, email, password };
    console.log(body);
    try {
      const user = await axios.post("/home/signup", body);
      const { token } = user.data;
      localStorage.setItem("sampleAuthToken", token);
      console.log(localStorage);
      JsLoadingOverlay.hide();

      window.location.replace("../start");
    } catch (err) {
      alert(`invalid email or username`);
      JsLoadingOverlay.hide();
    }
  });

  // --> SIGNUP AND GET TOKEN
  $("#logInForm").submit(async (e) => {
    JsLoadingOverlay.show();
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();
    const body = { email, password };
    try {
      const user = await axios.post("/home/login", body);
      const { token } = user.data;

      const config = {
        headers: { Email: email },
      };
      const result = await axios.get("/home/usersinfo", config);
      // const userId = result.data.result.id;
      // document.cookie = `userId=${userId}`;
      localStorage.setItem("sampleAuthToken", token);
      console.log(localStorage);
      // const config = {
      //   headers: { Authorization: `Bearer ${token}` },
      // };
      // axios.get("/start", config);
      window.location.replace("../start");
      JsLoadingOverlay.hide();
    } catch (err) {
      console.log(err);
      alert(`invalid email or username`);
      JsLoadingOverlay.hide();
    }
  });
});
