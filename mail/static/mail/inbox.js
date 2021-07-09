document.addEventListener('DOMContentLoaded', function() {
  //alert("DOM LOADED")
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
  
  // Send email onsubmit
  document.querySelector('#compose-form').onsubmit = function(event) {
    event.preventDefault();
    alert("Trying to submit ");
    return send_email();
    
  };
  	
  // Close alert message
  document.querySelector('.close').addEventListener('click', () => {
    alert('close');
    event.target.parentElement.style.display = "none";
  });
  
  // Load email on click
  document.querySelectorAll('.email-item').forEach((item) => {
  	alert('Load email');
    item.addEventListener('click', () => {
      // event.preventDefault();
      alert("ok");
      alert(event.target.dataset.email_id);
      view_email(event.target.dataset.email_id);
    });
  });
  
}); // DOMContentLoaded end

document.querySelectorAll('.email-item').forEach((item) => {
  	alert('Load email');
    item.addEventListener('click', () => {
      // event.preventDefault();
      alert("ok");
      alert(event.target.dataset.email_id);
      view_email(event.target.dataset.email_id);
    });
  });

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


function load_mailbox(mailbox) {
  //alert(mailbox);
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 // console.log(mailbox);
  
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
  
    //alert(Object.keys(emails).length);
  	display_mailbox(emails);
  	console.log(emails);
  })
  	//alert(emails);
  .catch(error => {
  	alert(error);
    console.log('Error: ', error);
  });
}


function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject : subject,
      body : body
    })
  })
  .then(response => response.json())
  .then(result => {
  // Print result
    console.log(result);
    //alert(result);
  
    let status = result.error ? 
  `<div class="alert alert-danger"><a href="#" 
  class="close">&times;</a>${result.error}</div>` : 
  `<div class="alert alert-success"><a href="#"
  class="close">&times;</a>${result.message}</div>`;
  document.querySelector('body').innerHTML += status;
  
    return true
  })
  .catch(error => {
    console.log('Error: ', error);
    return false;
  });

    
}


function display_mailbox(emails) {
  
  if (Object.keys(emails).length < 1) {
    let h4 = `<h4 class="text-warning">Wow, such empty :-)</h4>`;
    document.querySelector('#emails-view').innerHTML += h4;
  }
  // Create html content
  let ul = document.createElement('ul');
  ul.className = 'list-unstyled';
  
  emails.forEach((email) => {
  	ul.innerHTML += `<li class="email-item border t4ext-decoration-none" data-email_id="${email.id}"><strong 
  	class="mr-2">${email.recipients}</strong> ${email.subject}<span
  	 class="float-right">${email.timestamp}</span></li>`;
  });
  
  document.querySelector('#emails-view').appendChild(ul);

}


function view_email(email_id) {
  fetch(`\emails\${email_id}`)
  .then(reponse => reponse.json())
  .then(email => {
    console.log();
    
    let show_email = `<ul class="list-unstyled">
    <li ><strong>From:</strong> ${email.sender}</li>
    <li><strong>To:</strong>${email.recipients}</li>
    <li><strong>Timestamp:</strong>${email.timestamp}</li>;
    </ul>
    <button class="reply-email btn btn-sm btn-outline-primary">Reply</button>
    <br>
    <p>${email.body}</p>`;
    
    document.querySelector('#emails-view').innerHTML = show_email;
  })
  .catch(error => {
    console.log('Error: ', error);
  });


}