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
  const customers = await prisma.Customers.findMany()
  const photos = await prisma.OfficePhoto.findMany()
  res.render("admin.ejs", {
    user: req.user,
    countQuestions: countQuestions.length,
    vendors: vendors.length,
    customers: customers.length,
    photos: photos.length
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
    include: {
      companyBlocks: {
        include: {
          products: true
        }
      }
    }
  });
  // console.log(vendors)
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
router.post("/vendors/blocks/add/:id", async (req, res) => {
  const newBlock = await prisma.CompanyBlocks.create({
    data: {
      title: 'New block',
      companyId: Number(req.params.id)
    },
  });
  res.redirect(`/admin/vendors/${req.params.id}`);
});
router.get("/vendors/:companyId/blocks/delete/:id", async (req, res) => {
  const deleteBlock = await prisma.CompanyBlocks.delete({
    where: {
      id: Number(req.params.id)
    }
  })
  res.redirect(`/admin/vendors/${req.params.companyId}`)
})
router.get("/vendors/:companyId/blocks/update/:id", async (req, res) => {
  const block = await prisma.CompanyBlocks.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })
  // console.log(block)
  res.render('admin/updateVendorsBlock.ejs', {user: req.user, updateBlock: block, vendorsId: req.params.companyId})
})
router.post("/vendors/:companyId/blocks/update/:id", async (req, res) => {
  const updateBlock = await prisma.CompanyBlocks.update({
    where: {
      id: Number(req.params.id)
    },
    data: {
      title: req.body.title,
      description: req.body.description,
      link: req.body.link
    }
  })
  res.render('admin/updateVendorsBlock.ejs', {user: req.user, updateBlock: updateBlock, vendorsId: req.params.companyId})
})
router.post("/vendors/:companyId/products/update/:id", async (req, res) => {
  const updateProduct = await prisma.Products.update({
    where: {
      id: Number(req.params.id)
    },
    data: {
      title: req.body.productTitle,
      description: req.body.productDescription,
      products: req.body.productProducts,
      link: req.body.productLink
    }
  })
  res.redirect(`/admin/vendors/${req.params.companyId}`)
})
router.post('/vendors/:companyId/products/add/:blockId', async (req, res) => {
  const product = await prisma.Products.create({
    data: {
      title: 'Новый товар',
      link: '',
      companyBlocksId: Number(req.params.blockId)
    }
  })
  res.redirect(`/admin/vendors/${req.params.companyId}`)
})
router.get('/vendors/:companyId/products/delete/:blockId', async (req, res) => {
  const product = await prisma.Products.delete({
    where: {
      id: Number(req.params.blockId)
    }
  })
  res.redirect(`/admin/vendors/${req.params.companyId}`)
})



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

router.get('/customers', async (req, res) => {
  const customers = await prisma.Customers.findMany()
  res.render('admin/customers.ejs', {user: req.user, customers: customers})
})
router.get('/customers/create', (req, res) => {
  res.render('admin/createCustomers.ejs', {user: req.user})
})
router.post('/customers/create', async (req, res) => {
  const customer = await prisma.Customers.create({
    data: {
      name: req.body.name,
      officialSite: req.body.officialSite,
      imageUrl: req.files[0].filename
    }
  })
  res.redirect(`/admin/customers/edit/${customer.id}`)
})
router.get('/customers/edit/:id', async (req, res) => {
  const customer = await prisma.Customers.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })
  res.render('admin/updateCustomers.ejs', {user: req.user, customer: customer})
})
router.post('/customers/edit/:id', async (req, res) => {
  if(req.files[0]){
    const customer = await prisma.Customers.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        name: req.body.name,
        officialSite: req.body.officialSite,
        imageUrl: req.files[0].filename
      }
    })
  } else {
    const customer = await prisma.Customers.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        name: req.body.name,
        officialSite: req.body.officialSite,
      }
    })
  }
  res.redirect(`/admin/customers/edit/${req.params.id}`)
})

router.get('/photos', async (req, res) => {
  const photos = await prisma.OfficePhoto.findMany()
  res.render('admin/photos.ejs', {user: req.user, photos: photos})
})
router.get('/photos/create', (req, res) => {
  res.render('admin/createPhoto.ejs', {user: req.user})
})
router.post('/photos/create', async (req, res) => {
  const photo = await prisma.OfficePhoto.create({
    data: {
      imageUrl: req.files[0].filename
    }
  })
  res.redirect('/admin/photos')
})
router.get('/photos/delete/:id', async (req, res) => {
  const photo = await prisma.OfficePhoto.delete({
    where: {
      id: Number(req.params.id)
    }
  })
  res.redirect('/admin/photos')
})


router.post("/create", PostsController.createPost);

module.exports = router;
