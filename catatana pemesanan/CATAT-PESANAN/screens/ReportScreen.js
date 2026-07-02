import * as React from 'react';
import {
SafeAreaView,
View,
Text,
StyleSheet,
FlatList
} from 'react-native';

const formatRupiah = (num) =>
"Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function ReportScreen({ orders }) {

const totalIncome = orders.reduce(
(sum, item) => sum + item.total,
0
);

const totalOrder = orders.length;

const selesai = orders.filter(
item => item.status?.trim() === "Selesai"
).length;

const proses = orders.filter(
item => item.status?.trim() === "Sedang Diproses"
).length;

return ( <SafeAreaView style={styles.safe}><View style={styles.container}>


    <Text style={styles.title}>
      Laporan Pemesanan
    </Text>

    <View style={styles.cardBlue}>
      <Text style={styles.white}>
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

      <View style={styles.box}>
        <Text>Selesai</Text>
        <Text style={styles.green}>
          {selesai}
        </Text>
      </View>
    </View>

    <View style={styles.box2}>
      <Text>Sedang Diproses</Text>
      <Text style={styles.orange}>
        {proses}
      </Text>
    </View>

    <Text style={styles.subtitle}>
      Riwayat Pesanan
    </Text>

    <FlatList
      data={orders}
      keyExtractor={(item, index) =>
        index.toString()
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.bold}>
            {item.name}
          </Text>

          <Text>
            {item.product}
          </Text>

          <Text>
            {item.qty} Kg/pcs
          </Text>

          <Text>
            {formatRupiah(item.total)}
          </Text>

          <Text
            style={{
              marginTop: 5,
              fontWeight: "bold",
              color:
                item.status === "Selesai"
                  ? "green"
                  : "orange"
            }}
          >
            {item.status}
          </Text>
        </View>
      )}
    />

  </View>
</SafeAreaView>


);
}

const styles = StyleSheet.create({
safe: {
flex: 1,
backgroundColor: "#f5f5f5",
paddingTop: 20
},

container: {
padding: 20,
flex: 1
},

title: {
fontSize: 22,
fontWeight: "bold",
marginBottom: 10
},

cardBlue: {
backgroundColor: "#3B82F6",
padding: 20,
borderRadius: 15,
marginBottom: 10
},

white: {
color: "#fff"
},

bigWhite: {
color: "#fff",
fontSize: 24,
fontWeight: "bold"
},

row: {
flexDirection: "row",
justifyContent: "space-between"
},

box: {
backgroundColor: "#fff",
padding: 15,
borderRadius: 10,
width: "48%"
},

box2: {
backgroundColor: "#fff",
padding: 15,
borderRadius: 10,
marginTop: 10
},

subtitle: {
marginTop: 15,
marginBottom: 10,
fontWeight: "bold"
},

card: {
backgroundColor: "#fff",
padding: 15,
borderRadius: 10,
marginBottom: 10
},

bold: {
fontWeight: "bold"
},

green: {
color: "green",
fontWeight: "bold"
},

orange: {
color: "orange",
fontWeight: "bold"
}
});
