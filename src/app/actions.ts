'use server';

import clientPromise from '../lib/mongodb';

const DB_NAME = 'media_pembelajaran_gi';

export async function saveGroupData(groupData: any) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    await db.collection('groups').updateOne(
      { groupName: groupData.groupName },
      { $set: groupData },
      { upsert: true }
    );
    console.log(`[DB SUCCESS] Kelompok ${groupData.groupName} disimpan.`);
    return { success: true };
  } catch (error) {
    console.error("[DB ERROR] saveGroupData:", error);
    return { success: false };
  }
}

export async function getGroupData(groupName: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const data = await db.collection('groups').findOne({ groupName });
    
    // Jika data tidak ada, kembalikan null
    if (!data) return null;

    // JANGAN ubah data._id secara langsung.
    // Buat object baru (copy) dan timpa _id menjadi string
    return {
      ...data,
      _id: data._id.toString(),
    };

  } catch (error) {
    console.error("[DB ERROR] getGroupData:", error);
    return null;
  }
}

export async function saveLKPD(groupName: string, lkpdData: any) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Tambahkan upsert: true di sini agar jika nama kelompok terhapus, dia otomatis bikin baru
    await db.collection('groups').updateOne(
      { groupName },
      { $set: { lkpd: lkpdData, groupName: groupName } },
      { upsert: true } 
    );
    console.log(`[DB SUCCESS] LKPD Kelompok ${groupName} disimpan.`);
    return { success: true };
  } catch (error) {
    console.error("[DB ERROR] saveLKPD:", error);
    return { success: false };
  }
}

export async function sendChatMessage(groupName: string, userName: string, message: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    await db.collection('chats').insertOne({
      groupName,
      userName,
      message,
      createdAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("[DB ERROR] sendChatMessage:", error);
    return { success: false };
  }
}

export async function getChatMessages(groupName: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const messages = await db.collection('chats')
      .find({ groupName })
      .sort({ createdAt: 1 }) 
      .toArray();
      
    return messages.map((msg: any) => ({
      _id: msg._id.toString(),
      groupName: msg.groupName,
      userName: msg.userName,
      message: msg.message,
      createdAt: msg.createdAt.toISOString()
    }));
  } catch (error) {
    console.error("[DB ERROR] getChatMessages:", error);
    return [];
  }
}

export async function saveEvaluation(groupName: string, userName: string, evalData: any) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    await db.collection('evaluations').insertOne({
      groupName,
      userName,
      ...evalData,
      submittedAt: new Date()
    });
    console.log(`[DB SUCCESS] Evaluasi ${userName} disimpan.`);
    return { success: true };
  } catch (error) {
    console.error("[DB ERROR] saveEvaluation:", error);
    return { success: false };
  }
}

// ==========================================
// 6. FORUM KELAS GLOBAL (Fase Presentasi)
// ==========================================
export async function sendForumMessage(groupName: string, userName: string, message: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    await db.collection('forum_kelas').insertOne({
      groupName,
      userName,
      message,
      createdAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("[DB ERROR] sendForumMessage:", error);
    return { success: false };
  }
}

export async function getForumMessages() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const messages = await db.collection('forum_kelas')
      .find({})
      .sort({ createdAt: 1 }) 
      .toArray();
      
    return messages.map((msg: any) => ({
      _id: msg._id.toString(),
      groupName: msg.groupName,
      userName: msg.userName,
      message: msg.message,
      createdAt: msg.createdAt.toISOString()
    }));
  } catch (error) {
    console.error("[DB ERROR] getForumMessages:", error);
    return [];
  }
}

export async function getAllGroupsList() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Ambil semua kelompok, tapi hanya ambil field 'groupName' saja
    const groups = await db.collection('groups')
      .find({})
      .project({ groupName: 1, _id: 0 })
      .toArray();
      
    return groups.map((g: any) => g.groupName);
  } catch (error) {
    console.error("[DB ERROR] getAllGroupsList:", error);
    return [];
  }
}

// 1. BUAT KELOMPOK BARU (Oleh Ketua)
export async function createGroup(groupName: string, leaderName: string, topic: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Generate Kode Unik 6 Digit (Misal: 7X92A1)
    const groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newGroup = {
      groupName,
      groupCode,
      topic,
      members: [leaderName], // Ketua otomatis jadi member pertama
      createdAt: new Date(),
      lkpd: {} // Placeholder LKPD
    };

    await db.collection('groups').insertOne(newGroup);
    
    return { success: true, groupCode, groupName };
  } catch (error) {
    console.error("Error createGroup:", error);
    return { success: false, error: 'Gagal membuat kelompok' };
  }
}

// 2. GABUNG KELOMPOK (Oleh Anggota)
export async function joinGroup(groupCode: string, memberName: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Cari kelompok berdasarkan kode
    const group = await db.collection('groups').findOne({ groupCode });

    if (!group) {
      return { success: false, error: 'Kode kelompok tidak ditemukan!' };
    }

    // Cek apakah nama sudah ada (opsional, biar tidak duplikat)
    if (!group.members.includes(memberName)) {
      // PERBAIKAN DI SINI: Gunakan 'as any' agar TypeScript tidak error pada $push
      await db.collection('groups').updateOne(
        { groupCode },
        { $push: { members: memberName } as any } 
      );
    }

    return { 
      success: true, 
      groupName: group.groupName, 
      topic: group.topic 
    };
  } catch (error) {
    console.error("Error joinGroup:", error);
    return { success: false, error: 'Gagal bergabung' };
  }
}

// 3. SIMPAN EVALUASI INDIVIDU
// (Update fungsi saveEvaluation yang lama agar lebih spesifik)
export async function saveIndividualEvaluation(groupName: string, userName: string, data: any) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Gunakan updateOne dengan upsert agar jika user submit ulang, datanya tertimpa (bukan duplikat)
    await db.collection('evaluations').updateOne(
      { groupName, userName }, // Kunci unik: Nama User di dalam Kelompok tsb
      { 
        $set: {
          ...data,
          submittedAt: new Date()
        }
      },
      { upsert: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Error saveEvaluation:", error);
    return { success: false };
  }
}