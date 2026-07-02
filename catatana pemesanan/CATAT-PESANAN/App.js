import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import HomeScreen from "./screens/HomeScreen";
import OrderScreen from "./screens/OrderScreen";
import ReportScreen from "./screens/ReportScreen";
import { Ionicons } from "@expo/vector-icons";

import {
  initDB,
  getOrders,
} from "./database/database";

export default function App() {
  const [tab, setTab] = useState("home");
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    const setup = async () => {
      await initDB();
      await loadOrders();
    };

    setup();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {tab === "home" && (
        <HomeScreen orders={orders} />
      )}

      {tab === "order" && (
       <OrderScreen
          orders={orders}
          refreshOrders={loadOrders}
        />
      )}

      {tab === "report" && (
        <ReportScreen orders={orders} />
      )}

      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => setTab("home")}
          style={styles.navItem}
        >
          <Ionicons
            name={tab === "home" ? "home" : "home-outline"}
            size={22}
            color={tab === "home" ? "#3B82F6" : "gray"}
          />
          <Text
            style={[
              styles.navText,
              tab === "home" ? styles.active : styles.inactive,
            ]}
          >
            Beranda
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTab("order")}
          style={styles.navItem}
        >
          <Ionicons
            name={tab === "order" ? "clipboard" : "clipboard-outline"}
            size={22}
            color={tab === "order" ? "#3B82F6" : "gray"}
          />
          <Text
            style={[
              styles.navText,
              tab === "order" ? styles.active : styles.inactive,
            ]}
          >
            Pesanan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTab("report")}
          style={styles.navItem}
        >
          <Ionicons
            name={tab === "report" ? "bar-chart" : "bar-chart-outline"}
            size={22}
            color={tab === "report" ? "#3B82F6" : "gray"}
          />
          <Text
            style={[
              styles.navText,
              tab === "report" ? styles.active : styles.inactive,
            ]}
          >
            Laporan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 35,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  navText: {
    fontSize: 12,
    marginTop: 4,
  },

  active: {
    color: "#3B82F6",
    fontWeight: "bold",
  },

  inactive: {
    color: "gray",
  },
});