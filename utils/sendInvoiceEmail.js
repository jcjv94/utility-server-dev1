const emailDebugger = require("debug")("app:email");

// Make a sendInvoiceEmail module in utils
const sendInvoiceGeneric = require("./sendEmailGeneric");

const weekdays = [
  { day: "Mon", dayName: "Monday" },
  { day: "Tue", dayName: "Tuesday" },
  { day: "Wed", dayName: "Wednesday" },
  { day: "Thu", dayName: "Thursday" },
  { day: "Fri", dayName: "Friday" },
  { day: "Sat", dayName: "Saturday" },
  { day: "Sun", dayName: "Sunday" }
];

sendInvoiceEmail = async input => {
  emailDebugger("%%%%%%%%%%%%%%%%%%% Invoice Email %%%%%%%%%%%%%%%%%%%%%%%%%%");
  emailDebugger("sendInvoiceEmail payschedule:", input);
  emailDebugger("################### Email Body Pieces ######################");
  let dayName;
  if (input.paySchedule.value === "installment") {
    // emailDebugger("!!!!!!!!!!!!!!!!!! we are in installment");
    let insType = input.paySchedulePolicy.installmentType;
    // emailDebugger("insType:", insType);
    if (insType === "weekly" || insType === "bi-weekly") {
      // emailDebugger(
      //   "inside weekly: input.paySchedulePolicy.payByDayOfWeek :",
      //   input.paySchedulePolicy.payByDayOfWeek
      // );
      weekdays.forEach(obj => {
        if (obj.day === input.paySchedulePolicy.payByDayOfWeek) {
          dayName = obj.dayName;
        }
      });
    }
  }
  emailDebugger("Reached here 1 ........................");
  let invReq = input.items;

  let itemPortion = "<ol>";
  let totCost = 0;
  invReq.forEach(obj => {
    totCost = totCost + obj.cost;
    // emailDebugger('totCost:', totCost, ' obj.cost:', obj.cost );
    let ill = 45; // Item line length
    let itemName;
    if (obj.itemName.length > 40) {
      itemName = obj.itemName.substring(0, 44);
    } else {
      itemName = obj.itemName;
    }
    let dottedLineLength = ill - itemName.length;

    let dotLine = "";
    for (var i = 0; i < dottedLineLength; i++) {
      dotLine = dotLine + ".";
    }
    itemPortion =
      itemPortion +
      "<li>" +
      obj.itemName +
      "&nbsp;" +
      dotLine +
      "(" +
      obj.quantity +
      "&nbsp;@&nbsp;$&nbsp;" +
      obj.price +
      " for " +
      obj.unitName +
      "&nbsp;)" +
      "&nbsp;&nbsp;&nbsp;$ <b>" +
      obj.cost.toFixed(2) +
      "</b></li>";
  });
  itemPortion = itemPortion + "</ol>";

  //   emailDebugger('itemPortion: ', itemPortion);
  //   return '';

  let invoiceHeader = "";
  invoiceHeader =
    invoiceHeader +
    "<font color='blue' size='4'><b>" +
    input.orgName +
    "</b></font><br/>";
  invoiceHeader =
    invoiceHeader +
    "<font color='blue' size='3'><b>" +
    input.orgType1 +
    "</b></font><br/>";
  invoiceHeader =
    invoiceHeader +
    "<font color='blue' size='3'><b>" +
    input.orgType2 +
    "</b></font><br/><br/>";
  invoiceHeader =
    invoiceHeader +
    "<font color='#7826bf' size='3'>Invoice #:&nbsp;<b>" +
    input.invoiceId +
    "</b></font><br/>";
  invoiceHeader =
    invoiceHeader +
    "<font color='#7826bf' size='3'>Name:&nbsp;<b>" +
    input.customerName +
    "</b></font><br/><br/>" +
    "<font color='black' size='3'><b>Itemized breakdown:</b>";

  let payPolicyL1 = "";
  let payPolicyL2 = "";
  let payPolicyL3 = "";
  let payPolicyL4 = "";
  if (input.paySchedule.value === "fullpay") {
    payPolicyL1 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Payment Status: Paid in full<br/>";
  } else if (input.paySchedule.value === "partpay") {
    payPolicyL1 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;payment Status: Paid in part<br/.>";
    payPolicyL2 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next Payment due on:&nbsp;" +
      input.paySchedulePolicy.nextSchedulePayDay.substring(0, 10);
    +"<br/>";
  } else {
    payPolicyL1 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Payment Process: To be paid in installment<br/>";
    payPolicyL2 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next Payment due on:&nbsp;" +
      input.paySchedulePolicy.nextSchedulePayDay.substring(0, 10) +
      "<br/>";
    payPolicyL3 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Installment type:&nbsp;" +
      input.paySchedulePolicy.installmentType +
      "<br/>";
    if (
      input.paySchedulePolicy.installmentType === "monthly" ||
      input.paySchedulePolicy.installmentType === "bi-monthly"
    ) {
      payPolicyL4 =
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be paid by&nbsp;" +
        input.paySchedulePolicy.payByDateOfMonth +
        "&nbsp; day of the month." +
        "<br/>>";
    } else {
      // payPolicyL4 =
      //   "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be paid by&nbsp;" +
      //   input.paySchedulePolicy.payByDayOfWeek +
      //   "&nbsp; day of the week." +
      //   "<br/>>";
      if (input.paySchedulePolicy.installmentType === "weekly") {
        payPolicyL4 =
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be paid by&nbsp;" +
          dayName +
          "&nbsp; of every week." +
          "<br/>>";
      } else {
        payPolicyL4 =
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be paid by&nbsp;" +
          dayName +
          "&nbsp; of every two weeks." +
          "<br/>>";
      }
    }
  }

  let totalSection = "";
  let lineBuffer =
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  totalSection =
    lineBuffer +
    "Total Itemized Cost:&nbsp;$&nbsp;<b>" +
    totCost.toFixed(2) +
    "</b><br/>";
  if (input.finBreakdown.discountAmount > 0) {
    totalSection =
      totalSection +
      lineBuffer +
      "Discount Amount:&nbsp;$&nbsp;<b>" +
      input.finBreakdown.discountAmount.toFixed(2) +
      "</b><br/>";
  }
  if (input.finBreakdown.taxAmount > 0) {
    totalSection =
      totalSection +
      lineBuffer +
      "Tax Amount:&nbsp;$&nbsp;<b>" +
      input.finBreakdown.taxAmount.toFixed(2) +
      "</b><br/>";
  }
  totalSection =
    totalSection +
    lineBuffer +
    "Total Invoice Amount:&nbsp;$&nbsp;<b>" +
    input.finBreakdown.totalInvoiceAmount.toFixed(2) +
    "</b></br>";
  totalSection =
    totalSection +
    lineBuffer +
    "Total Amount Paid:&nbsp;$&nbsp;<b>" +
    input.finBreakdown.amountPaid.toFixed(2) +
    "</b><br/><br/>";

  let note = "";
  //   emailDebugger('note:', input.invoiceNote );

  note =
    "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Note</b>:&nbsp;" +
    input.invoiceNote +
    "<br/><br/>";

  let signature =
    "&nbsp;&nbsp;&nbsp;<font color='black'><i>Thank your for your business ... </i><br/><br/>" +
    "&nbsp;&nbsp;&nbsp;<font color='blue'><b>" +
    input.senderName +
    "</b></font><br/>" +
    "&nbsp;&nbsp;&nbsp;<font color='blue'><b>" +
    input.senderEmail +
    "</font></b><br/>" +
    "&nbsp;&nbsp;&nbsp;<font color='blue'><b>" +
    input.senderFooterLine3 +
    "</font></b><br/>";
  let invHtml;
  invHtml =
    "<pre>" +
    invoiceHeader +
    itemPortion +
    totalSection +
    payPolicyL1 +
    payPolicyL2 +
    payPolicyL3 +
    payPolicyL4 +
    note +
    signature;
  ("</pre>");

  emailDebugger("Reached here 2 ........................");

  emailData = {
    subject: input.orgName,
    toEmail: input.toEmail,
    replyTo: input.senderEmail,
    body: invHtml
  };
  emailDebugger("Before  calling  sendInvoiceGeneric emailData:", emailData);

  let retEmail = await sendInvoiceGeneric(emailData);

  emailDebugger("sendInvoiceEmail retEmail:", retEmail);

  return retEmail;
};

module.exports = sendInvoiceEmail;
