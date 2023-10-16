import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Suraj",
    image: "../suraj.png",
    balance: -70,
  },
  {
    id: 933372,
    name: "Ujala",
    image: "../ujala.png",
    balance: 200,
  },
  {
    id: 499476,
    name: "Ronak",
    image: "../ronak.png",
    balance: 0,
  },
];

// ------------button ------------
function Button({ children, handleClick }) {
  return (
    <button className="button" onClick={handleClick}>
      {children}
    </button>
  );
}

// ------------App ------------
export default function App() {
  const [showFriendform, setShowFriendForm] = useState(false);

  const [friends, setFriends] = useState(initialFriends);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowFriendForm(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((curSelected) =>
      curSelected?.id === friend.id ? null : friend
    );
    setShowFriendForm(false);
  }

  function handleSplitBill(value) {
    console.log(value)
    
    setFriends((friends) => friends.map((friend) => friend.id === selectedFriend.id ? {...friend ,balance : friend.balance + value}: friend));

    setSelectedFriend(null);

  }

  return (
    <>
   <h2 className="heading"> 💰🧾 Bill Spliting </h2>
   
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showFriendform && <FormAddFriend onAddFriend={handleFriend} />}

        <Button handleClick={() => setShowFriendForm(!showFriendform)}>
          {showFriendform ? "close" : " Add Friend"}
        </Button>
      </div>

      {selectedFriend && 
      <FormSplitBill 
      selectedFriend={selectedFriend}
      onSpiltBill = {handleSplitBill}
       />}
    </div>
    <button className="sub-heading">
  <a href="https://jyoti-km.vercel.app/" target="_blank" rel="noopener noreferrer">
    -Made by Jyoti
  </a>
</button>
  
    </>
  );
}

// ------------Friends List ------------
function FriendsList({ friends, selectedFriend, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

// ------------Friend ------------

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You will pay {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} will pay me ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button handleClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

// ------------Form Add Friend------------
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function addFriend(e) {
    e.preventDefault();

    const id = crypto.randomUUID();
    console.log(id);
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={addFriend}>
      <label>👯 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🎆 Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

// ------------Form Split Bill------------
function FormSplitBill({ selectedFriend , onSpiltBill}) {
  const [bill, setBill] = useState();
  const [paidByUser, setPaidByUser] = useState();
  const paidByfriend = bill ? bill - paidByUser : "";
  const [whoPay, setWhoPay] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    onSpiltBill(whoPay ==='user' ? paidByfriend : -paidByUser)
    
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split Bill With {selectedFriend.name}</h2>

      <label>💰 Bill Ammount</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍🏼‍♂️ your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👯 {selectedFriend.name}'s expense </label>
      <input type="text" disabled value={paidByfriend} />

      <label>🤑 who is paying bill</label>
      <select value={whoPay} onChange={(e) => setWhoPay(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
