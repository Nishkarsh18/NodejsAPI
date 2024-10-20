//get all jobs // /api/v1/jobs
const Job = require("./jobsdb");
const geocoder = require("./geocoder");
const errorHandler = require("./errorHandler");
const catchAsyncError = require("./catchasyncerror");
const apiFilters = require("./apifilter");
const { authJwt } = require("./authmiddleware");
const path = require("path");;
//function to return all jobs
exports.getjobs = catchAsyncError(async (req, res, next) => {
  console.log(req.query.jobType);
  const apiFilter = new apiFilters(Job.find(), req.query)
    .filter()
    .sort()
    .limitfields()
    .searchbyquery()
    .pagination();
  const alljob = await apiFilter.query;
  res.status(200).json({
    success: true,
    message: alljob,
    user: req.user,
  });
  //console.log(Date.now());
});

//function to create new job
exports.newJob = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const job = await Job.create(req.body);
  console.log("Job Successfully Created");
  res.status(200).json({
    success: true,
    message: "Job Created",
    data: job,
  });
  next();
});

// get jobs within radius
// api/v1/jobs/:zipcode/:distance
exports.getjobsinradius = catchAsyncError(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // getting lat and lang from zipcode
  const loc = await geocoder.geocode(zipcode);
  const latitude = loc[0].latitude;
  const longitude = loc[0].longitude;

  // query to find job within radius
  const radius = distance / 3693;
  const jobs = await Job.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  console.log(loc[0]);
  res.status(200).json({
    success: true,
    message: jobs,
  });
  next();
});

// update a job - post method
// api/v1/jobs/:id

exports.updateJob = catchAsyncError(async (req, res, next) => {
  // find if job exists
  let job = await Job.findById(req.params.id);
  if (!job) {
    return next(new errorHandler("Job not found", 404));
  }
  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: job,
  });
  next();
});

exports.deleteJob = catchAsyncError(async (req, res, next) => {
  let job = await Job.findById(req.params.id);
  if (!job) {
    return next(new errorHandler("Job not found", 404));
  }
  let dltjob = await Job.findByIdAndDelete(req.params.id);
  console.log("object deleted");
  return res.status(200).json({
    status: true,
  });
});

//get job by id and slug

exports.getJobById = catchAsyncError(async (req, res, next) => {
  let id = req.params.id;
  let slug = req.params.slug;
  let job = await Job.find({ $and: [{ _id: id }, { slug: slug }] });
  if (!job) {
    return next(new errorHandler("Job not found", 404));
  }
  let njob = await Job.find({ $and: [{ _id: id }, { slug: slug }] });
  res.status(200).json({
    data: njob,
  });
});

//get stats of a job by topic
// will be using aggeration in mongodb which is like groupby
// create index in monogodb for title first
// /stats/:topic

exports.getStats = catchAsyncError(async (req, res, next) => {
  let topic = req.params.topic;
  //let job = await Job.find({ slug: topic });
  const stats = await Job.aggregate([
    {
      $match: { $text: { $search: '"' + topic + '"' } },
    },
    {
      $group: {
        _id: { $toUpper: "$experience" }, //further grouping by experience
        totaljobs: { $sum: 1 },
        avgPosition: { $avg: "$position" },
        minsalary: { $min: "$salary" },
        maxsalary: { $max: "$salary" },
        avgSalary: { $avg: "$salary" },
      },
    },
  ]);
  if (stats.length == 0) {
    return res.status(404).json({
      message: "No such job",
    });
  }
  return res.status(200).json({
    success: true,
    message: stats,
  });
  next();
});

// apply to job using resume
// api/v1/jobs/:id/apply

exports.applyJob = catchAsyncError(async (res, res, next) => {
  let job = await Job.findById(req.params.id).select('+applicantsApplied');
  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }
  if (job.lastDate < new (Date(Date.now()))()) {
    return next(new ErrorHandler("Job expired", 404));
  }
  //check files
  if (!req.files) {
    return next(new ErrorHandler("No file uploaded", 404));
  }
  const file = req.files.file;
  //check file type
  const allowedtype = /.docs|.pdf/;
  if (!allowedtype.test(path.extname(file.name))) {
    return next(new ErrorHandler("Invalid file type", 404));
  }
  //check if user already applied or not
for(let i = 0;i<job.applicantsApplied.length;i++)
  {
    if(applicantsApplied[i].user === req.user.id)
    {
      return next(new ErrorHandler("Already Applied", 404));
    }
  }
  //check file size
  if (file.size > 100000)
  {
    return next(new ErrorHandler("File Size Exceed", 404));
  }
  // renaming document/resume
  file.name = `${req.user.name.replace(' ','_')_${job._id)${path.parse(file.name).ext}`;
  file.mv(`${__dirname}/../public/resumes/${file.name}`,async err =>
    {
      if(err)
      {
      console.log(err);
      return next(new ErrorHandler("Failed", 404));
      }
      await Job.findByIdandUpdate(req.params.id, {$push:
        {
          appliedapplicant : {
            id : req.user.id,
            resume : file.name,
          }
        }},{

            new : true,
            runValidators : true,
            useFindAndModify : false,
        });
      res.status(200).json({
        success : true
      })
    });
});
