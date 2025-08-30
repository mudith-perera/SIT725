// scripts.js - refactored for MVC backend at /api/projects

const addCards = (items) => {
  $("#card-section").empty();
  items.forEach((item) => {
    const itemToAppend =
      '<div class="col s12 m6 l4">' +
      '<div class="card large">' +
      '<div class="card-image waves-effect waves-block waves-light">' +
      '<img class="activator" src="' +
      item.image +
      '" />' +
      "</div>" +
      '<div class="card-content">' +
      '<span class="card-title activator grey-text text-darken-4">' +
      item.title +
      '<i class="material-icons right">more_vert</i></span>' +
      '<p><a href="#">' +
      item.link +
      "</a></p></div>" +
      '<div class="card-reveal">' +
      '<span class="card-title grey-text text-darken-4">' +
      item.title +
      '<i class="material-icons right">close</i></span>' +
      '<p class="card-text">' +
      item.desciption +
      "</p>" +
      "</div></div></div>";
    $("#card-section").append(itemToAppend);
  });
};

const getProjects = () => {
  $.get("/api/projects", (response) => {
    if (response.statusCode === 200) {
      addCards(response.data);
    } else {
      console.error("Failed to load projects", response);
    }
  }).fail((err) => {
    console.error("GET /api/projects failed", err);
  });
};

const submitForm = () => {
  const title =
    $("#first_name").val() || $("#projectTitle").val() || "Untitled";
  const author =
    $("#last_name").val() || $("#projectAuthor").val() || "Anonymous";
  const link = $("#projectLink").val() || "#";
  const desciption =
    $("#projectDesc").val() || $("#projectDescription").val() || "";
  const image = $("#projectImage").val() || "/images/kitten.png";

  const payload = { title, author, link, desciption, image };

  $.ajax({
    url: "/api/projects",
    method: "POST",
    data: JSON.stringify(payload),
    contentType: "application/json",
    success: function (response) {
      if (response.statusCode === 201) {
        $("#modal1").modal("close");
        // clear form fields
        $(
          "#first_name, #last_name, #projectTitle, #projectAuthor, #projectLink, #projectDesc, #projectImage"
        ).val("");
        getProjects();
      } else {
        console.error("Failed to create project", response);
      }
    },
    error: function (err) {
      console.error("POST /api/projects failed", err);
    },
  });
};

$(document).ready(function () {
  $(".materialboxed").materialbox();
  $("#formSubmit").click(() => {
    submitForm();
  });
  getProjects();
  $(".modal").modal();
});

// Sockets
const socket = io();

socket.on("number", (msg) => {
  console.log("Random number:", msg);
  document.getElementById("number").innerText = msg;
});
