const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const request = require("supertest");

chai.use(sinonChai);
const { expect } = chai;

const app = require("../server");
const Project = require("../models/projectModel");
describe("API: /api/projects", function () {
  let findStub;
  let saveStub;
  let consoleStub;

  beforeEach(() => {
    consoleStub = sinon.stub(console, "error"); // mute controller logs
  });
  afterEach(function () {
    sinon.restore();
  });

  it("GET /api/projects -> 200 with data array and Success message", async function () {
    const fakeDocs = [
      { _id: "1", title: "A", createdAt: new Date("2025-01-01") },
      { _id: "2", title: "B", createdAt: new Date("2025-01-02") },
    ];

    const sortStub = { lean: sinon.stub().resolves(fakeDocs) };
    findStub = sinon.stub(Project, "find").returns({ sort: () => sortStub });

    const res = await request(app).get("/api/projects").expect(200);
    expect(res.body).to.have.property("statusCode", 200);
    expect(res.body).to.have.property("message", "Success");
    expect(res.body.data).to.be.an("array").with.length(2);
    expect(Project.find).to.have.been.calledOnceWithExactly({});
  });

  it("GET /api/projects -> 500 on DB error", async function () {
    const sortStub = { lean: sinon.stub().rejects(new Error("DB down")) };
    findStub = sinon.stub(Project, "find").returns({ sort: () => sortStub });

    const res = await request(app).get("/api/projects").expect(500);
    expect(res.body).to.deep.include({
      statusCode: 500,
      message: "Internal server error",
    });
  });

  it("POST /api/projects -> 201 with provided fields persisted", async function () {
    saveStub = sinon.stub(Project.prototype, "save").resolves();

    const payload = {
      title: "Skill Swap – Guitar",
      link: "https://example.com/guitar",
      description: "Teach basic chords",
      image: "/images/guitar.png",
      author: "Alex",
    };

    const res = await request(app)
      .post("/api/projects")
      .send(payload)
      .set("Content-Type", "application/json")
      .expect(200);

    expect(res.body).to.have.property("statusCode", 201);
    expect(res.body).to.have.property("message", "Created");
    expect(res.body.data).to.include({
      title: "Skill Swap – Guitar",
      link: "https://example.com/guitar",
      image: "/images/guitar.png",
      author: "Alex",
    });
    expect(res.body.data).to.have.property("desciption", "Teach basic chords");
    expect(saveStub).to.have.been.calledOnce;
  });

  it("POST /api/projects -> applies defaults when fields are missing", async function () {
    saveStub = sinon.stub(Project.prototype, "save").resolves();

    const res = await request(app)
      .post("/api/projects")
      .send({}) // no fields provided
      .set("Content-Type", "application/json")
      .expect(200);

    expect(res.body).to.have.property("statusCode", 201);
    expect(res.body.data).to.include({
      title: "Untitled",
      link: "",
      image: "/images/kitten.png",
      author: "Anonymous",
    });
    expect(res.body.data).to.have.property("desciption", "");
  });

  it("POST /api/projects -> 500 on save error", async function () {
    saveStub = sinon
      .stub(Project.prototype, "save")
      .rejects(new Error("save failed"));

    const res = await request(app)
      .post("/api/projects")
      .send({ title: "X" })
      .set("Content-Type", "application/json")
      .expect(500);

    expect(res.body).to.deep.include({
      statusCode: 500,
      message: "Internal server error",
    });
  });
});
