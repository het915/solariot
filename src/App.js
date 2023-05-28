import "./App.css";
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase-config";
import { ref, onValue } from "firebase/database";
import Charts from "./Components/TemperatureChart";
import VoltageChart from "./Components/VoltageChart";
import CurrentChart from "./Components/CurrentChart";
import Navbar from "./Components/Navbar";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [userData, setUserData] = useState({});
  const [userVoltageData, setUserVoltageData] = useState({});
  const [userCurrentData, setUserCurrentData] = useState({});

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    const hello = ref(
      db,
      "UsersData/" + "DyuCcrt7n6ZXLiUxpQ2DmLHLMfP2/" + "readings/"
    );
    onValue(hello, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      const newPosts = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setData(newPosts.reverse());
    });
  }, [user]);

  useEffect(() => {
    if (data?.length != 0) {
      setUserData({
        labels: data?.slice(0, 10).map((item) => item.timestamp),
        datasets: [
          {
            label: "Temperature",
            data: data?.slice(0, 10).map((item) => item.temperature),
            tension: 0.4,
            borderColor: "rgb(255, 99, 132)",
          },
        ],
      });
      setUserVoltageData({
        labels: data?.slice(0, 10).map((item) => item.timestamp),
        datasets: [
          {
            label: "Voltage",
            data: data?.slice(0, 10).map((item) => item.voltage),
            tension: 0.4,
            borderColor: "rgb(255, 99, 132)",
          },
        ],
      });
      setUserCurrentData({
        labels: data?.slice(0, 10).map((item) => item.timestamp),
        datasets: [
          {
            label: "Current",
            data: data?.slice(0, 10).map((item) => item.current),
            tension: 0.4,
            borderColor: "rgb(255, 99, 132)",
          },
        ],
      });
    }
  }, [data]);
  console.log(data?.slice(0, 10));

  function epochToJsDate(epochTime) {
    return new Date(epochTime * 1000);
  }
  // convert time to human-readable format YYYY/MM/DD HH:MM:SS
  function epochToDateTime(epochTime) {
    var epochDate = new Date(epochToJsDate(epochTime));
    var dateTime =
      epochDate.getDate() +
      "/" +
      ("00" + (epochDate.getMonth() + 1)).slice(-2) +
      "/" +
      ("00" + epochDate.getFullYear()).slice(-2) +
      " " +
      ("00" + epochDate.getHours()).slice(-2) +
      ":" +
      ("00" + epochDate.getMinutes()).slice(-2) +
      ":" +
      ("00" + epochDate.getSeconds()).slice(-2);
    return dateTime;
  }

  return (
    <div className="App">
      <Navbar />
      {!user && (
        <div className="register_user">
          <div>
            <input
              type="text"
              placeholder="Email..."
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Password..."
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <button
            onClick={() => {
              login();
            }}
          >
            Login
          </button>
        </div>
      )}

      {user && (
        <div>
          <div>
            {userData.labels && (
              <div>
                <div>
                  Line - <span>{data[0]?.temperature}°C</span>
                </div>
                <Charts chartData={userData} width="700px" />
              </div>
            )}
          </div>

          <div>
            <div>
              {userData.labels && (
                <div>
                  <div>
                    Line - <span>{data[0]?.current}A</span>
                  </div>
                  <VoltageChart chartData={userVoltageData} width="700px" />
                </div>
              )}
            </div>
          </div>
          <div>
            {userData.labels && (
              <div>
                <div>
                  Line - <span>{data[0]?.current}A</span>
                </div>
                <CurrentChart chartData={userCurrentData} width="700px" />
              </div>
            )}
          </div>
          <div>
            {data?.map((item, idx) => {
              return (
                <div key={idx}>
                  <table width={"100%"}>
                    <tr>
                      <th>Time</th>
                      <th>Temperature</th>
                      <th>Current</th>
                      <th>Voltage</th>
                    </tr>
                    <tr>
                      <td>{epochToDateTime(item.timestamp)}</td>
                      <td>{item.temperature}</td>
                      <td>{item.current}</td>
                      <td>{item.voltage}</td>
                    </tr>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
