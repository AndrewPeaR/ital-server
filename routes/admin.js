const Router = require("express").Router;
const router = new Router();

const QuestionsController = require("../controllers/questions-controller");
const PostsController = require("../controllers/posts-controller");
const AdminController = require("../controllers/admin-controller");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const countQuestions = await prisma.Questions.findMany();
  const vendors = await prisma.Company.findMany();
  res.render("admin.ejs", {
    user: req.user,
    countQuestions: countQuestions.length,
    vendors: vendors.length,
  });
});

router.get("/questions", QuestionsController.getAllQuestions);
router.get("/questions/apply/:id", async (req, res) => {
  if (req.user?.email) {
    const question = await prisma.Questions.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    const countQuestions = await prisma.Questions.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: !question.status,
      },
    });
    res.redirect("/admin/questions");
  } else {
    res.redirect("/admin/questions");
  }
});
router.get("/questions/delete/:id", async (req, res) => {
  if (req.user?.email) {
    const countQuestions = await prisma.Questions.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.redirect("/admin/questions");
  } else {
    res.redirect("/admin/questions");
  }
});

router.get("/vendors", async (req, res) => {
  const vendors = await prisma.Company.findMany();
  res.render("admin/vendors.ejs", { user: req.user, vendors: vendors });
});
router.get("/vendors/create", (req, res) => {
  res.render("admin/createVendors.ejs", { user: req.user });
});
router.get("/vendors/:id", async (req, res) => {
  const vendors = await prisma.Company.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });
  res.render("admin/updateVendors.ejs", { user: req.user, vendors: vendors });
});
router.post("/vendors/create", async (req, res) => {
  const slug = req.body.name.toLowerCase()
  const newVendor = await prisma.Company.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      officialSite: req.body.officialSite,
      CompanyTag: req.body.CompanyTag,
      slug: slug,
      imageUrl: req.files[0].filename,
    },
  });
  res.redirect(`/admin/vendors/${newVendor.id}`);
  // res.redirect(`/faq/${newQuestion.id}`)
});
router.post("/vendors/update/:id", async (req, res) => {
  if (req.files[0]) {
    const slug = req.body.name.toLowerCase()
    const newVendor = await prisma.Company.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: req.body.name,
        description: req.body.description,
        officialSite: req.body.officialSite,
        CompanyTag: req.body.CompanyTag,
        slug: slug,
        imageUrl: req.files[0].filename,
      },
    });
  } else {
    const slug = req.body.name.toLowerCase()
    const newVendor = await prisma.Company.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: req.body.name,
        description: req.body.description,
        officialSite: req.body.officialSite,
        CompanyTag: req.body.CompanyTag,
        slug: slug
      },
    });
  }
  res.redirect(`/admin/vendors/${req.params.id}`);
  // res.redirect(`/faq/${newQuestion.id}`)
});
router.get("/vendors/delete/:id", async (req, res) => {
  if (req.user?.email) {
    const deleteVendors = await prisma.Company.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.redirect("/admin/vendors");
  } else {
    res.redirect("/admin/vendors");
  }
});

router.get('/about', async (req, res) => {
  const items = await prisma.About.findMany()
  res.render('admin/about.ejs', {user: req.user, items: items})
})
router.get('/about/edit/:slug', async (req, res) => {
  const item = await prisma.About.findUnique({
    where: {
      slug: req.params.slug
    }
  })
  res.render('admin/updateAbout.ejs', {user: req.user, item: item})
})
router.post('/about/edit/:slug', async (req, res) => {
  const item = await prisma.About.findUnique({
    where: {
      slug: req.params.slug
    }
  })
  if(item.type === 'text'){
    await prisma.About.update({
      where: {
        slug: req.params.slug
      },
      data: {
        value: req.body.description
      }
    })
  } else if(item.type === 'image'){
    await prisma.About.update({
      where: {
        slug: req.params.slug
      },
      data: {
        value: req.files[0].filename
      }
    })
  }
  res.redirect(`/admin/about/edit/${item.slug}`)
})

router.post("/create", PostsController.createPost);

module.exports = router;
