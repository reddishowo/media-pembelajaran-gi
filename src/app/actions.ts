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