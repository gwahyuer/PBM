import * as React from "react";
import {
View,
Text,
StyleSheet,
SafeAreaView,
TouchableOpacity,
} from "react-native";

const formatRupiah = (num) =>
"Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function HomeScreen({ orders }) {
const [selected, setSelected] = React.useState(null);
const [showDetail, setShowDetail] = React.useState(false);

const totalIncome = orders.reduce(
(sum, item) => sum + item.total,
0
);

const totalOrder = orders.length;

// ================= DETAIL =================
if (showDetail && selected) {
return ( <SafeAreaView style={styles.safe}><View style={styles.container}><Text style={styles.title}>
Detail Pesanan </Text>


      <View style={styles.card}>
        <Text style={styles.bold}>
          {selected.name}
        </Text>

        <Text style={styles.label}>
          Produk
        </Text>

        <Text>
          {selected.product}
        </Text>

        <Text style={styles.label}>
          Harga
        </Text>

        <Text>
          {formatRupiah(selected.price)}
        </Text>

        <Text style={styles.label}>
          Jumlah
        </Text>

        <Text>
          {selected.qty} Kg/pcs
        </Text>

        <Text style={styles.label}>
          Status
        </Text>

        <Text
          style={{
            color:
              selected.status === "Selesai"
                ? "green"
                : "orange",
            fontWeight: "bold",
          }}
        >
          {selected.status}
        </Text>

        <Text style={styles.label}>
          Tanggal
        </Text>

        <Text>
          {selected.date}
        </Text>

        <Text style={styles.label}>
          Total
        </Text>

        <Text style={styles.price}>
          {formatRupiah(selected.total)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() =>
          setShowDetail(false)
        }
      >
        <Text>Kembali</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);


}

// ================= BERANDA =================
return ( <SafeAreaView style={styles.safe}><View style={styles.container}><Text style={styles.date}>
{new Date().toLocaleDateString()} </Text>

    <Text style={styles.title}>
      Catatan Pemesanan
    </Text>

    <View style={styles.cardBlue}>
      <Text style={styles.textWhite}>
        Total Pendapatan
      </Text>

      <Text style={styles.bigWhite}>
        {formatRupiah(totalIncome)}
      </Text>
    </View>

    <View style={styles.row}>
      <View style={styles.box}>
        <Text>Total Pesanan</Text>

        <Text style={styles.bold}>
          {totalOrder}
        </Text>
      </View>
    </View>

    <Text style={styles.subtitle}>
      Pesanan Terbaru
    </Text>

    {orders.length === 0 ? (
      <Text
        style={{
          color: "gray",
          marginTop: 10,
        }}
      >
        Belum ada pesanan.
      </Text>
    ) : (
      orders
        .slice(0, 3)
        .map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              setSelected(item);
              setShowDetail(true);
            }}
          >
            <Text style={styles.bold}>
              {item.name}
            </Text>

            <Text>
              {item.product}
            </Text>

            <Text>
              {item.qty} Kg/pcs
            </Text>

            <Text
              style={{
                color:
                  item.status ===
                  "Selesai"
                    ? "green"
                    : "orange",
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              {item.status}
            </Text>

            <Text style={styles.price}>
              {formatRupiah(item.total)}
            </Text>
          </TouchableOpacity>
        ))
    )}
  </View>
</SafeAreaView>


);
}

const styles = StyleSheet.create({
safe: {
flex: 1,
backgroundColor: "#f5f5f5",
paddingTop: 20,
},

container: {
padding: 20,
flex: 1,
},

date: {
color: "gray",
marginBottom: 5,
},

title: {
fontSize: 22,
fontWeight: "bold",
marginBottom: 10,
},

cardBlue: {
backgroundColor: "#3B82F6",
padding: 20,
borderRadius: 15,
marginVertical: 10,
},

textWhite: {
color: "#fff",
},

bigWhite: {
color: "#fff",
fontSize: 22,
fontWeight: "bold",
},

row: {
flexDirection: "row",
},

box: {
backgroundColor: "#E0F2FE",
padding: 15,
borderRadius: 10,
width: "100%",
},

subtitle: {
marginTop: 15,
fontWeight: "bold",
},

card: {
backgroundColor: "#fff",
padding: 15,
borderRadius: 10,
marginTop: 10,
},

price: {
color: "#2563EB",
marginTop: 5,
fontWeight: "bold",
},

label: {
marginTop: 8,
fontSize: 12,
color: "gray",
},

bold: {
fontWeight: "bold",
},

btnSecondary: {
backgroundColor: "#ddd",
padding: 12,
borderRadius: 10,
alignItems: "center",
marginTop: 10,
},
});
