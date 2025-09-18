const Staff = require("./staffModels");
const bcrypt = require("bcrypt");

const rolePrefixes = {
  teacher: "TCH",
  admin: "ADM",
  accountant: "ACC",
  staff: "STF" // fallback
};

async function generateUsername(staffId, role) {
  const rolePrefix = rolePrefixes[role.toLowerCase()] || rolePrefixes["staff"];
  return `${rolePrefix}${staffId}`;
}

exports.createStaff = async(req,res)=>{
  // console.log("req:", req.body);
    const {personalInfo,status  } = req.body;
    try{

        const requiredFields = ["name", "staffId", "role", "email","assignedClasses", "password", "department"];

        for(let fields of requiredFields){
          console.log(fields);
            if(!personalInfo[fields]){
                return res.status(400).json({
                    success: false,
                    message: `${fields} is required`
                })
            }
        }
        
        personalInfo.username = await generateUsername(
            personalInfo.staffId,
            personalInfo.role
        );

        const hashedPassword = await bcrypt.hash(personalInfo.password, 10);
        personalInfo.password = hashedPassword;

        const newStaff = await Staff.create({
            personalInfo,
            status
        });
        const staff = await Staff.findById(newStaff._id);
        
        res.status(201).json({
            success: true,
            message: "Staff created successfully",
            staff: staff
        })
    }
    catch (error) {
        console.error("Error creating Staff:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find(); // fetch all staff records

    res.status(200).json({
      success: true,
      staff: staff
    });
    // console.log(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

exports.getStaffById = async(req,res)=>{
  const {id} = req.params;
  try{
    if(!id)
      return res.status(404).json({
        success: false,
        message: "ID invalid/missing",
      });
    
    const staffDoc = await Staff.findById(id);
    if(!staffDoc)
    return res.status(404).json({
      success: false,
      message: "Staff not found",
    }); 
    
    res.status(200).json({
        success:true,
        staff: staffDoc
    })
  }catch(error){
    console.error("Error Viewing Staff Profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

exports.updateStaff = async(req,res)=>{
  console.log("updateStaff req", req.body);
  const {id}= req.params;
  const updateData = req.body;
  try{
    if(!id)
      return res.status(404).json({
        success: false,
        message: "ID invalid/missing",
      });

    const unhashPass = updateData.personalInfo?.password;
// If password is being updated, hash it
    if (updateData.personalInfo?.password) {
      updateData.personalInfo.password = await bcrypt.hash(
        updateData.personalInfo.password,
        10
      );
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    const reply = {
      ...updatedStaff,
      ...updatedStaff.personalInfo.password = unhashPass
    }    
    res.json({ message: "Staff updated successfully", data: updatedStaff });
  }catch(error){
    res.status(500).json({ message: "Error updating staff", error: error.message });
  }
}

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id)
      return res.status(404).json({
        success: false,
        message: "ID invalid/missing",
      });
    
    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff", error: error.message });
  }
};