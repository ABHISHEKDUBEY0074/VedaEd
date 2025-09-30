const Staff = require("./staffModels");
const bcrypt = require("bcrypt");

const rolePrefixes = {
  teacher: "TCH",
  admin: "ADM",
  accountant: "ACC",
  staff: "STF" // fallback
};

// async function generateUsername(staffId, role) {
//   const rolePrefix = rolePrefixes[role.toLowerCase()] || rolePrefixes["staff"];
//   return `${rolePrefix}${staffId}`;
// }

exports.createStaff = async(req,res)=>{
    const {personalInfo,status  } = req.body;
    try{

        const requiredFields = ["name", "staffId", "role", "email", "password", "department"];

        for(let fields of requiredFields){
          console.log(fields);
            if(!personalInfo[fields]){
                return res.status(400).json({
                    success: false,
                    message: `${fields} is required`
                })
            }
        }

        // Normalize role to match enum values
        if (personalInfo.role) {
            const validRoles = ["Teacher", "Principal", "Accountant", "Admin", "HR", "Other"];
            const normalizedRole = personalInfo.role.charAt(0).toUpperCase() + personalInfo.role.slice(1).toLowerCase();
            if (validRoles.includes(normalizedRole)) {
                personalInfo.role = normalizedRole;
            }
        }

        // Generate username if not provided
        if (!personalInfo.username) {
            personalInfo.username = `${personalInfo.role}_${personalInfo.staffId}`;
        }

        // Map assignedClasses to classesAssigned for the model
        const staffData = {
            personalInfo,
            status
        };

        // Handle assignedClasses if provided
        if (personalInfo.assignedClasses) {
            staffData.classesAssigned = personalInfo.assignedClasses;
            // Remove assignedClasses from personalInfo as it's not in the schema
            delete personalInfo.assignedClasses;
        }

        const newStaff = await Staff.create(staffData);
        const staff = await Staff.findById(newStaff._id);
        console.log("staff", staff);
        res.status(201).json({
            success: true,
            message: "Staff created successfully",
            staff: staff
        })
    }
    catch (error) {
        console.error("Error creating Staff:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error",
            error: error.message 
        });
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

    // Find the existing staff first
    const existingStaff = await Staff.findById(id);
    if (!existingStaff) {
      return res.status(404).json({ 
        success: false,
        message: "Staff not found" 
      });
    }

    let unhashedPassword = null;
    
    // If password is being updated, hash it
    if (updateData.personalInfo?.password) {
      unhashedPassword = updateData.personalInfo.password;
      updateData.personalInfo.password = await bcrypt.hash(
        updateData.personalInfo.password,
        10
      );
    }

    // Use $set operator to only update specific fields
    const updateFields = {};
    if (updateData.personalInfo) {
      Object.keys(updateData.personalInfo).forEach(key => {
        updateFields[`personalInfo.${key}`] = updateData.personalInfo[key];
      });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: false }
    );

    if (!updatedStaff) {
      return res.status(404).json({ 
        success: false,
        message: "Staff not found" 
      });
    }
    
    const responseData = {
      ...updatedStaff.toObject(),
      personalInfo: {
        ...updatedStaff.personalInfo,
        password: unhashedPassword || updatedStaff.personalInfo.password
      }
    };
    
    res.status(200).json({ 
      success: true,
      message: "Staff updated successfully", 
      staff: responseData 
    });
  }catch(error){
    console.error("Error in updateStaff:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      success: false,
      message: "Error updating staff", 
      error: error.message 
    });
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