// Creates groups in a community
// If request is from community creation create a group named 'default'
// If request is from createNewGroup ... regular group creation
const mongoose = require("mongoose");

// DB Schemas
const User = require("../../models/user");
const Group = require("../../models/group");
const AllBaandaId = require("../../models/allBaandaID");
const Community = require("../../models/community");

createGroups = async data => {
  console.log("----- Generic group creation data:", data);
  // data = { communityId, baandaId, callingProgram, groupName, groupDescription }
  let retMsg;
  const session = await mongoose.startSession();
  session.startTransaction();
  const opts = { session };
  try {
    // 0. Get creatorName ... etc.
    let creator = await User.find({ baandaId: data.baandaId }).select(
      "-_id name email"
    );
    if (creator.length === 0) {
      throw new Error("Creator not found in DB. Seek Baanda support");
    }
    // 1. Get a new groupId
    let groupIdObj = await AllBaandaId.findOneAndUpdate(
      { ref: "group-id" },
      { $inc: { newbaandadomainid: 1 } },
      opts
    );
    let ngi = groupIdObj.newbaandadomainid;

    // 2. Save in groups
    let creatorMember = [
      {
        baandaId: data.baandaId,
        email: creator[0].email,
        memberName: creator[0].name,
        inviteSent: true,
        response: "Accepted",
        joinDate: Date.now(),
        role: "Creator"
      }
    ];
    // 3. Define group name and description as 'default' if created at the time of community creation.
    // let grpName = "default";
    // let grpDescription = "Default group created on community creation.";
    // if (data.callingProgram !== "saveNewCommunity") {
    grpName = data.groupName;
    grpDescription = data.groupDescription;
    // }
    // 4. Form the group to be saved in Group collection.
    console.log("--- grpName:", grpName);
    let group = new Group({
      communityId: data.communityId,
      groupId: ngi,
      groupName: grpName,
      description: grpDescription,
      members: creatorMember,
      Status: true,
      updated_at: Date.now(),
      updated_by_bid: data.baandaId
    });

    // 5. Save the group in groups collection
    let ret1 = await group.save(opts);
    console.log('reached here 11');
    // 6. Create a member to be inserted into user collection to indicate that user is a member of this group.
    let member = {
      communityId: data.communityId,
      groupId: ngi,
      role: "Creator"
    };
    console.log('--- member:', member);
    let updateUserRet = await User.findOneAndUpdate(
      { baandaId: data.baandaId },
      { $push: { memberOf: member } },
      { safe: true, new: true, upsert: true, session:session }
    //   opts
    );
    console.log('reached here 22 updateUserRet:', updateUserRet);

    // 7. If not called from saveNewCommunity then insert the group in the
    let newCommGroup = {
      groupdId: ngi,
      groupName: grpName
    };
    console.log('----- newCommGroup:', newCommGroup);

    if (data.callingProgram !== "saveNewCommunity") {
     await Community.findOneAndUpdate(
        { communityId: data.communityId },
        { $push: { createdGroups: newCommGroup } },
        opts
      );
    }

    // newCommGroup is used only when creating a new community. It cannot be inserted in community here for new community creation for the community do not exist yet.
    retMsg = { status: "success", msg: newCommGroup };
    await session.commitTransaction();
  } catch (err) {
    console.log("---- createGroup Err:", err.message);
    await session.abortTransaction();
    retMsg = { status: "success", msg: err.message };
  } finally {
    session.endSession();
  }

  return retMsg;
};

module.exports = createGroups;
