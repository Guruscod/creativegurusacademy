// =====================
// Modal Functions
// =====================
function showEnrollmentModal() {
  document.getElementById('enrollmentModal').style.display = 'flex';
}

function hideEnrollmentModal() {
  document.getElementById('enrollmentModal').style.display = 'none';
}

// =====================
// Course Prices (GHS × 100 = pesewas)
// =====================
const coursePrices = {
  "Microsoft Office Essentials": 20000,
  "Google Workspace Tools": 20000,
  "AI Career Essentials": 20000,
  "Graphic Design & Web Development": 20000
};

// =====================
// Reset Submit Button
// =====================
function resetSubmitButton() {
  const btn = document.getElementById('payButton');
  btn.textContent = "Pay Now with Paystack";
  btn.disabled = false;
}

// =====================
// Paystack Payment
// =====================
function payWithPaystack(fullName, email, whatsapp, course, cohort) {
  const amount = coursePrices[course] || 65000;

  const popup = new PaystackPop();
  popup.newTransaction({
    key: 'pk_live_73fe5713c4861a8dcd10fd7e6cbc0eba01285ce5',
    email: email,
    amount: amount,
    currency: "GHS",
    ref: 'CGA-' + Date.now(),
    metadata: {
      custom_fields: [
        { display_name: "Full Name", variable_name: "name",     value: fullName },
        { display_name: "WhatsApp",  variable_name: "whatsapp", value: whatsapp },
        { display_name: "Course",    variable_name: "course",   value: course   },
        { display_name: "Cohort",    variable_name: "cohort",   value: cohort   }
      ]
    },
    onSuccess: function(response) {
      alert("✅ Payment Successful! Ref: " + response.reference + "\nOur team will contact you on WhatsApp shortly.");
      hideEnrollmentModal();
      document.getElementById('enrollForm').reset();
      resetSubmitButton();
    },
    onCancel: function() {
      alert("Payment was cancelled. You can try again.");
      resetSubmitButton();
    },
    onError: function(error) {
      alert("Payment Error: " + (error.message || "Please try again."));
      resetSubmitButton();
    }
  });
}

// =====================
// Form Submit Handler
// =====================
function handleSubmit(e) {
  e.preventDefault();

  const btn = document.getElementById('payButton');
  btn.textContent = "Opening Paystack...";
  btn.disabled = true;

  const fullName = document.getElementById('fullName').value.trim();
  const whatsapp = document.getElementById('phone').value.trim();
  const email    = document.getElementById('email').value.trim();
  const course   = document.getElementById('course').value;
  const cohort   = document.getElementById('cohort').value;

  if (!fullName || !email || !whatsapp || !course || !cohort) {
    alert("Please fill in all fields.");
    resetSubmitButton();
    return;
  }

  payWithPaystack(fullName, email, whatsapp, course, cohort);
}

// =====================
// Attach Handlers (runs after DOM is ready)
// =====================
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('enrollForm').addEventListener('submit', handleSubmit);

  document.getElementById('enrollmentModal').addEventListener('click', function (e) {
    if (e.target === this) hideEnrollmentModal();
  });
});
