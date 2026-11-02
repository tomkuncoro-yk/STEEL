// Common words that are usually left out of word counts.
// Short lists on purpose: easy to read, easy to extend. All lowercase.
// Apostrophes are plain ' (the word counter converts curly ones).

export const englishStopwords: string[] = [
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'also', 'am', 'amp', 'an', 'and',
  'any', 'are', "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'can', "can't", 'cannot', 'cant', 'could', "couldn't", 'did',
  "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'dont', 'down', 'during', 'each', 'few',
  'for', 'from', 'further', 'get', 'got', 'had', "hadn't", 'has', "hasn't", 'have', "haven't",
  'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself', 'him',
  'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm", "i've", 'if', 'im', 'in', 'into',
  'is', "isn't", 'it', "it's", 'its', 'itself', 'ive', 'just', "let's", 'me', 'more', 'most',
  "mustn't", 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'rt', 'same', "shan't",
  'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so', 'some', 'such', 'than',
  'that', "that's", 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  "there's", 'these', 'they', "they'd", "they'll", "they're", "they've", 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't", 'we', "we'd",
  "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where',
  "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's", 'will', 'with', "won't",
  'would', "wouldn't", 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours',
  'yourself', 'yourselves',
]

export const indonesianStopwords: string[] = [
  'ada', 'adalah', 'agar', 'aja', 'saja', 'aku', 'akan', 'amp', 'anda', 'antara', 'apa',
  'atau', 'bagaimana', 'bagi', 'banget', 'banyak', 'belum', 'bgt', 'bisa', 'bukan', 'dalam',
  'dan', 'dapat', 'dari', 'deh', 'demi', 'dengan', 'dg', 'dgn', 'di', 'dia', 'dimana', 'dong',
  'enggak', 'engga', 'ga', 'gak', 'gimana', 'harus', 'hanya', 'hingga', 'ia', 'ingin', 'ini',
  'itu', 'jadi', 'jangan', 'jgn', 'jika', 'juga', 'kah', 'kalau', 'kalo', 'kalian', 'kami',
  'kamu', 'kapan', 'karena', 'ke', 'kemudian', 'kenapa', 'kita', 'kok', 'krn', 'lagi', 'lah',
  'lalu', 'lebih', 'lho', 'loh', 'maka', 'masih', 'mau', 'mengapa', 'merupakan', 'menjadi',
  'mereka', 'namun', 'nggak', 'ngga', 'nih', 'nya', 'oleh', 'para', 'pada', 'pun', 'rt',
  'saat', 'sampai', 'sangat', 'saya', 'sdh', 'sebagai', 'sebelum', 'sedang', 'sedikit',
  'sehingga', 'sejak', 'sekali', 'selama', 'semua', 'seperti', 'serta', 'setelah', 'setiap',
  'siapa', 'sih', 'spt', 'sudah', 'supaya', 'tak', 'tapi', 'tdk', 'telah', 'tentang',
  'terhadap', 'tetapi', 'tidak', 'tuh', 'udah', 'udh', 'untuk', 'utk', 'waktu', 'ya', 'yaa',
  'yaitu', 'yakni', 'yang', 'yg',
]
