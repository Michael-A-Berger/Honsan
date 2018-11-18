// Getting the server models
const models = require('../models');

// Setting the Model constants
// const _Entry = models.Entry;
const _Copy = models.Copy;
const _Member = models.Member;

// MakeMember()
const MakeMember = (rq, rp) => {
  // IF the request body doesn't have the appropriate properties, say so
  if (!rq.body.firstName || !rq.body.lastName || !rq.body.cards) {
    const errorM = 'Every Member must have a first name, last name, and a card!';
    return rp.status(400).json({ error: errorM });
  }

  // Creating the new Member
  const tempCards = `${rq.body.cards}`;
  const memberData = {
    firstName: `${rq.body.firstName}`,
    lastName: `${rq.body.lastName}`,
    email: `${rq.body.email}`,
    cards: tempCards.split(','),
  };
  memberData.memberId = models.GenerateUniqueID();
  const apiReady = _Member.Model.ToAPI(memberData);

  // Saving the new Member to the database
  const newMember = new _Member.Model(apiReady);
  const memberPromise = newMember.save();

  // Setting up the save callback functions
  memberPromise.then(() => {
    console.log(`- Added Member [${memberData.firstName} ${memberData.lastName}] at ${models.CurrentTime()}`);
    rp.status(201).json({ message: 'Member added to the system' });
  });
  return memberPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return rp.status(400).json({ error: 'Member already exists.' });
    }

    return models.UnexpectedServerError(rq, rp);
  });
};

// GetAddMemberPage()
const GetAddMemberPage = (rq, rp) => {
  rp.render('add_member', { csrfToken: rq.csrfToken() });
};

// GetMemberListPage()
const GetMemberListPage = (rq, rp) => {
  const v = _Member.Model.GetAll((error, docs) => {
    if (error) {
      console.log(error);
      return models.UnexpectedServerError(rq, rp);
    }

    return rp.render('member_list', { members: docs });
  });
  return v;
};

// GetMemberPage()
const GetMemberPage = (rq, rp) => {
  const v = _Member.Model.GetByID(rq.query.id, (error1, docMember) => {
    // IF something went wrong, say so
    if (error1) {
      console.log(error1);
      return models.UnexpectedServerError(rq, rp);
    }

    // IF the Member doesn't exist...
    if (docMember === null || docMember === undefined) {
      return rp.render('member', { member: null });
    }

    // Getting the Member's borrowed Copies
    return _Copy.Model.GetAllBorrowedByMember(docMember.member_id, (error2, docBorrowed) => {
      // IF there was an error, say so
      if (error2) {
        console.log(error2);
        return models.UnexpectedServerError(rq, rp);
      }

      // Setting the Member to an assignable object
      const currentMember = docMember;

      // IF books are borrowed, add them to the returned member
      if (docBorrowed.length > 0) {
        currentMember.borrowed = docBorrowed;
        let dueDate = '';
        for (let num = 0; num < currentMember.borrowed.length; num++) {
          dueDate = models.DayFromDate(currentMember.borrowed[num].due_date);
          currentMember.borrowed[num].due_date_str = dueDate;
        }
      }

      // Sending the Member page
      return rp.render('member', {
        member: currentMember,
        csrfToken: rq.csrfToken(),
      });
    });
  });

  // Returning the dummy value
  return v;
};

// Defining the exports
module.exports = {
  MakeMember,
  GetAddMemberPage,
  GetMemberListPage,
  GetMemberPage,
};
