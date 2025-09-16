const Subject = require('./subjectSchema');


function generatePrefix(name) {
  return name.substring(0, 3).toUpperCase(); // Math -> MATH, English -> ENG
}

// Generate unique subject code
async function generateSubjectCode(name) {
  const prefix = generatePrefix(name);

  // Find last subject with same prefix
  const lastSubject = await Subject.findOne({ subjectCode: new RegExp(`^${prefix}`) })
    .sort({ createdAt: -1 });

  let newNumber = 101; // start at 101
  if (lastSubject && lastSubject.subjectCode) {
    const match = lastSubject.subjectCode.match(/\d+$/);
    if (match) {
      newNumber = parseInt(match[0]) + 1;
    }
  }

  return `${prefix}${newNumber}`;
}


exports.createSubject = async(req,res)=>{
    const {subjectName, type} = req.body;
    try{
        if(!subjectName || !type) 
            return res.status(400).json({
                success: false,
                message: "Subject name and type required",
            })

        const code = await generateSubjectCode(subjectName);
        
        const newSubject = await Subject.create({subjectName, type, subjectCode:code});

        res.status(201).json({
        success: true,
        message: "Subject created successfully",
        data: newSubject,
        });

  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Invalid data", error: err.message });
  }

}

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 }); // newest first

    if (!subjects || subjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subjects found",
      });
    }

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};